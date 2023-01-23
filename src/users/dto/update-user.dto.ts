import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';
import { Schema } from 'mongoose';

export class UpdateUserParamDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  id: Schema.Types.ObjectId;
}

export class UpdateUserDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  firstName?: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  lastName?: string;

  @IsPhoneNumber(undefined, {
    message: i18nValidationMessage('validation.NOT_PHONE_NUMBER'),
  })
  @IsOptional()
  phone?: string;

  @Type(() => Date)
  @IsDate({ message: i18nValidationMessage('validation.NOT_DATE') })
  @IsOptional()
  birthDate?: Date;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  description?: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  city?: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  address?: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  @IsOptional()
  groupId?: Schema.Types.ObjectId;

  refreshToken?: string;
}
