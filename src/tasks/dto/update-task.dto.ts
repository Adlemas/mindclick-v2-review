import { IsISO8601, IsMongoId, IsNumber, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateTaskParamDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  id: string;
}

export class UpdateTaskDto {
  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  count: number;

  // ISO date - expiresAt: string;
  @IsISO8601(
    { strict: true },
    { message: i18nValidationMessage('validation.NOT_DATE') },
  )
  expiresAt: string;
}
