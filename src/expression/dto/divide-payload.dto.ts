import { IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class DividePayloadDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  first: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  second: string;

  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @IsOptional()
  remainder?: number;
}
