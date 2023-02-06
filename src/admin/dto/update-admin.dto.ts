import {
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsMongoId,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { PlanType } from 'src/enum/plan.enum';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Schema } from 'mongoose';

export class UpdateAdminParamsDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  id: Schema.Types.ObjectId;
}

export class UpdateAdminDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  firstName?: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  lastName?: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsPhoneNumber(undefined, {
    message: i18nValidationMessage('validation.NOT_PHONE_NUMBER'),
  })
  @IsOptional()
  phone?: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsISO8601(
    { strict: true },
    { message: i18nValidationMessage('validation.NOT_DATE') },
  )
  @IsOptional()
  birthDate?: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  description?: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  city?: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  address?: string;

  @IsEnum(PlanType, {
    message: i18nValidationMessage('validation.NOT_ENUM'),
  })
  @IsOptional()
  plan?: PlanType;

  @IsBoolean({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  @IsOptional()
  status?: boolean;
}
