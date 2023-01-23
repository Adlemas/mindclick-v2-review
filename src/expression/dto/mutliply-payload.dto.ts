import { ArrayMinSize, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class MultiplyPayloadDto {
  @IsString({
    each: true,
    message: i18nValidationMessage('validation.NOT_STRING_ARRAY'),
  })
  @ArrayMinSize(1, {
    message: i18nValidationMessage('validation.ARRAY_MIN_SIZE'),
  })
  first: string[];

  @IsString({
    each: true,
    message: i18nValidationMessage('validation.NOT_STRING_ARRAY'),
  })
  @ArrayMinSize(1, {
    message: i18nValidationMessage('validation.ARRAY_MIN_SIZE'),
  })
  second: string[];
}
