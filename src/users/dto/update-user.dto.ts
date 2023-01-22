import { IsDate, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';

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
  phone?: string | null;

  @Type(() => Date)
  @IsDate({ message: i18nValidationMessage('validation.NOT_DATE') })
  @IsOptional()
  birthDate?: Date | null;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  description?: string | null;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  city?: string | null;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  address?: string | null;

  refreshToken?: string;
}
