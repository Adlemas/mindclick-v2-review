import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Schema } from 'mongoose';

export class UpdateGroupDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  name: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  groupId: Schema.Types.ObjectId;
}
