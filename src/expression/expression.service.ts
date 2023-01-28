import {
  BadRequestException,
  Inject,
  Injectable,
  StreamableFile,
} from '@nestjs/common';

import { MentalPayloadDto } from 'src/expression/dto/mental-payload.dto';
import expression from 'src/lib/expression';

import { MultiplyPayloadDto } from 'src/expression/dto/mutliply-payload.dto';
import { MultiplyResponse } from 'src/expression/interface/multiply-response.interface';
import multiply from 'src/lib/multiply';

import { DividePayloadDto } from 'src/expression/dto/divide-payload.dto';
import { DivideResponse } from 'src/expression/interface/divide-response.interface';
import divide from 'src/lib/divide';
import { MentalDocumentPayloadDto } from 'src/expression/dto/mental-documet-query.dto';
import pdfGenerate from 'src/lib/pdf-generate';
import { from, Observable, of, switchMap } from 'rxjs';
import {
  divide as divideDoc,
  GenerateOptions,
  multiply as multiplyDoc,
} from 'src/lib/pug-divide-multiply';
import { MentalResponse } from 'src/expression/interface/mental-response.interface';
import { ExpressionResponse } from 'src/expression/interface/expression-response.interface';
import { User } from 'src/schemas/user.schema';
import { RewardPayloadDto } from 'src/expression/dto/reward-payload.dto';
import { RewardService } from 'src/monetization/service/reward.service';
import { LocaleService } from 'src/locale/locale.service';

@Injectable()
export class ExpressionService {
  @Inject(RewardService)
  private readonly rewardService: RewardService;

  @Inject(LocaleService)
  private readonly localeService: LocaleService;

  generateToken<T>(data: T): string {
    return Buffer.from(
      JSON.stringify({
        ...data,
        // ISO 8601 expiration date after 1 minute
        expires: new Date(Date.now() + 60000).toISOString(),
      }),
    ).toString('base64');
  }

  generateResponse<T extends { answer: string }>(
    data: T,
  ): ExpressionResponse & T {
    return {
      token: this.generateToken(data),
      ...data,
    };
  }

  decodeToken<T>(token: string): ExpressionResponse & T & { expires: string } {
    try {
      return JSON.parse(Buffer.from(token, 'base64').toString());
    } catch (e) {
      throw new BadRequestException(
        this.localeService.translate('errors.invalid_token'),
      );
    }
  }

  mental(payload: MentalPayloadDto): MentalResponse {
    const { formula, terms, min, max, isBiggerMax } = payload;
    const expr = expression(formula, terms, min, max, isBiggerMax);
    return this.generateResponse({
      expression: expr,
      answer: expr.reduce((sum, curr) => sum + curr, 0).toString(),
    });
  }

  mentalDocument(
    payload: MentalDocumentPayloadDto,
  ): Observable<StreamableFile> {
    return from(
      pdfGenerate(
        {
          formula: payload.formula,
          termLength: payload.terms,
          min: payload.min,
          max: payload.max,
        },
        payload.pageCount,
        {
          hCount: payload.hCount,
          vCount: payload.vCount,
          isAutoHeight: payload.isAutoHeight,
        },
        {
          byPage: payload.byPage,
          byRows: payload.byRows,
          isGrow: payload.isGrow,
          isGrowByRows: payload.isGrowByRows,
        },
        payload.orientation,
        payload.withRight,
        payload.design,
        payload.fileFormat,
      ),
    ).pipe(
      switchMap((stream) => {
        console.log({ stream });
        return of(new StreamableFile(stream));
      }),
    );
  }

  divideDocument(payload: DividePayloadDto, options: GenerateOptions) {
    return divideDoc(payload, options);
  }

  multiplyDocument(payload: MultiplyPayloadDto, options: GenerateOptions) {
    return multiplyDoc(payload, options);
  }

  multiply(payload: MultiplyPayloadDto): MultiplyResponse {
    const { first, second } = payload;
    const generated = multiply(
      first[0].length,
      second[0].length,
      first,
      second,
    );
    return this.generateResponse({
      ...generated,
      answer: String(generated.first * generated.second),
    });
  }

  divide(payload: DividePayloadDto): DivideResponse {
    const { first, second, remainder } = payload;
    const generated = divide(first, second, { remainder: remainder ?? 0 });
    return this.generateResponse({
      ...generated,
      answer: String(
        Math.floor(
          parseInt(generated.first, 10) / parseInt(generated.second, 10),
        ),
      ),
    });
  }

  reward(user: Observable<User>, payload: RewardPayloadDto) {
    return user.pipe(
      switchMap((user) => {
        const { token, answer, simulator } = payload;
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
        if (decoded.answer === answer) {
          return this.rewardService.reward(user._id, {
            simulator,
            points: 1,
            rate: 0,
          });
        }
        throw new BadRequestException(
          this.localeService.translate('errors.wrong_answer'),
        );
      }),
    );
  }
}
