import {
  IsEnum,
  IsISO8601,
  IsMongoId,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Schema } from 'mongoose';
import { PlanType } from 'src/enum/plan.enum';

export class CreateAdminDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  firstName: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  lastName: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  email: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsPhoneNumber(undefined, {
    message: i18nValidationMessage('validation.NOT_PHONE_NUMBER'),
  })
  phone: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsISO8601(
    { strict: true },
    { message: i18nValidationMessage('validation.NOT_DATE') },
  )
  birthDate: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  password: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  description: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  city: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  address: string;

  @IsEnum(PlanType, {
    message: i18nValidationMessage('validation.NOT_ENUM'),
  })
  plan: PlanType;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  createdBy: Schema.Types.ObjectId;
}
