import {
  IsISO8601,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Schema } from 'mongoose';

export class UpdateTaskParamDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  id: Schema.Types.ObjectId;
}

export class UpdateTaskDto {
  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  @IsOptional()
  count: number;

  // ISO date - expiresAt: string;
  @IsISO8601(
    { strict: true },
    { message: i18nValidationMessage('validation.NOT_DATE') },
  )
  @IsOptional()
  expiresAt: string;
}
