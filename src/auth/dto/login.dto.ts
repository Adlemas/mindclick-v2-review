import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  password: string;

  @IsBoolean({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  @IsOptional()
  rememberMe?: boolean;
}
