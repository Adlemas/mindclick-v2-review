import {
  IsDate,
  IsEmail,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';
import { Schema } from 'mongoose';

export class CreateUserDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  firstName: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  lastName: string;

  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @IsPhoneNumber(undefined, {
    message: i18nValidationMessage('validation.NOT_PHONE_NUMBER'),
  })
  phone: string;

  @Type(() => Date)
  @IsDate({ message: i18nValidationMessage('validation.NOT_DATE') })
  birthDate: Date;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  description: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  city: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  address: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  groupId: Schema.Types.ObjectId;

  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  rate: number;

  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  points: number;
}
