import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class MentalDocumentPayloadDto {
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
  @IsOptional()
  isBiggerMax?: boolean;
  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  pageCount: number;
  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  hCount: number;
  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  vCount: number;
  @IsBoolean({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  isAutoHeight: boolean;
  @IsBoolean({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  byPage: boolean;
  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  byRows: number;
  @IsBoolean({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  isGrow: boolean;
  @IsBoolean({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  isGrowByRows: boolean;
  @IsEnum(['p', 'l'], { message: i18nValidationMessage('validation.NOT_ENUM') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  orientation: 'p' | 'l';
  @IsBoolean({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  withRight: boolean;
  @IsBoolean({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  design: boolean;
  @IsEnum(['pdf', 'excel'], {
    message: i18nValidationMessage('validation.NOT_ENUM'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  fileFormat: 'pdf' | 'excel';
}
