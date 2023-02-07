import { IsNumberString, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SearchCitiesDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  query: string;

  @IsNumberString(undefined, {
    message: i18nValidationMessage('validation.NOT_NUMBER'),
  })
  limit: number;
}
