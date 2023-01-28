import { IsBase64, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RewardPayloadDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsBase64({ message: i18nValidationMessage('validation.NOT_BASE64') })
  token: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  answer: string;
}
