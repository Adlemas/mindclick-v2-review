import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Schema } from 'mongoose';

export class RemoveUserDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  readonly userId: Schema.Types.ObjectId;
}
