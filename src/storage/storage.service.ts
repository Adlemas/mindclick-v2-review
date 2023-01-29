import AWS3 from 'aws-sdk/clients/s3';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { from, Observable } from 'rxjs';
import { PromiseResult } from 'aws-sdk/lib/request';
import type { AWSError } from 'aws-sdk';
import { Buffer } from 'node:buffer';
import { Readable } from 'node:stream';

@Injectable()
export class StorageService {
  @Inject(ConfigService)
  private configService: ConfigService;

  private S3: AWS3;
  private readonly BUCKET: string;

  constructor() {
    this.S3 = new AWS3({
      accessKeyId: this.configService.getAwsAccessKey(),
      secretAccessKey: this.configService.getAwsSecretKey(),
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
    this.BUCKET = this.configService.getAwsBucketName();
  }

  getBlob(
    key: string,
  ): Observable<PromiseResult<AWS3.GetObjectOutput, AWSError>> {
    const params = {
      Bucket: this.BUCKET,
      Key: key,
    };

    return from(this.S3.getObject(params).promise());
  }

  putBlob(
    blobName: string,
    blob: Buffer,
  ): Observable<PromiseResult<AWS3.PutObjectOutput, AWSError>> {
    const params = {
      Bucket: this.BUCKET,
      Key: blobName,
      Body: blob,
    };
    return from(this.S3.putObject(params).promise());
  }

  putStream(key: string, stream: Readable): Observable<AWS3.PutObjectOutput> {
    return new Observable<AWS3.PutObjectOutput>(({ next, complete }) => {
      const chunks: Buffer[] = [];

      stream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      stream.once('end', () => {
        const fileBuffer = Buffer.concat(chunks);

        this.putBlob(key, fileBuffer).subscribe({
          next: (res) => {
            next(res);
            complete();
          },
          error: (err) => {
            throw new InternalServerErrorException(err);
          },
        });
      });

      stream.on('error', (err) => {
        throw new InternalServerErrorException(err);
      });
    });
  }
}
