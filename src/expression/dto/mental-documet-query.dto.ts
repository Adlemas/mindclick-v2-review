import {
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class MentalDocumentPayloadDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  formula: string;
  @IsNumberString(
    {},
    { message: i18nValidationMessage('validation.NOT_NUMBER') },
  )
  terms: number;
  @IsNumberString(
    {},
    { message: i18nValidationMessage('validation.NOT_NUMBER') },
  )
  min: number;
  @IsNumberString(
    {},
    { message: i18nValidationMessage('validation.NOT_NUMBER') },
  )
  max: number;
  @IsBooleanString({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  @IsOptional()
  isBiggerMax?: boolean;
  @IsNumberString(
    {},
    { message: i18nValidationMessage('validation.NOT_NUMBER') },
  )
  pageCount: number;
  @IsNumberString(
    {},
    { message: i18nValidationMessage('validation.NOT_NUMBER') },
  )
  hCount: number;
  @IsNumberString(
    {},
    { message: i18nValidationMessage('validation.NOT_NUMBER') },
  )
  vCount: number;
  @IsBooleanString({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  isAutoHeight: boolean;
  @IsBooleanString({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  byPage: boolean;
  @IsNumberString(
    {},
    { message: i18nValidationMessage('validation.NOT_NUMBER') },
  )
  byRows: number;
  @IsBooleanString({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  isGrow: boolean;
  @IsBooleanString({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  isGrowByRows: boolean;
  @IsEnum(['p', 'l'], { message: i18nValidationMessage('validation.NOT_ENUM') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  orientation: 'p' | 'l';
  @IsBooleanString({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  withRight: boolean;
  @IsBooleanString({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  design: boolean;
  @IsEnum(['pdf', 'excel'], {
    message: i18nValidationMessage('validation.NOT_ENUM'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  fileFormat: 'pdf' | 'excel';
}
