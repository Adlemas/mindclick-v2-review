import { IsEnum, IsISO8601, IsPhoneNumber, IsString } from 'class-validator';
import { PlanType } from 'src/enum/plan.enum';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateAdminDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  firstName: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  lastName: string;

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
  description: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  city: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  address: string;

  @IsEnum(PlanType, {
    message: i18nValidationMessage('validation.NOT_ENUM'),
  })
  plan: PlanType;
}
