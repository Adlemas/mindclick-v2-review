import { IsMongoId, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Schema } from 'mongoose';

export class RemoveGroupParamsDto {
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  groupId: Schema.Types.ObjectId;
}

export class RemoveGroupDto {
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  @IsOptional()
  newGroupId?: Schema.Types.ObjectId;
}
