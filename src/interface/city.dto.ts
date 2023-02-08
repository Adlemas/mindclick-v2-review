import { IsMongoId, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CityDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  _id: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  city: string;
}
