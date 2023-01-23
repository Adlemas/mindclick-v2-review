import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class MentalPayloadDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  formula: string;
  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @Min(2, { message: i18nValidationMessage('validation.MIN') })
  @Max(500, { message: i18nValidationMessage('validation.MAX') })
  terms: number;
  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  min: number;
  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @Min(2, { message: i18nValidationMessage('validation.MIN') })
  max: number;
  @IsBoolean({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  isBiggerMax: boolean;
}
