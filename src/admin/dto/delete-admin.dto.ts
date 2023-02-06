import { IsMongoId, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Schema } from 'mongoose';

export class DeleteAdminParamsDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  id: Schema.Types.ObjectId;
}
