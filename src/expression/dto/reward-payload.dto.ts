import { IsBase64, IsEnum, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Simulator } from 'src/enum/simulator.enum';

export class RewardPayloadDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsBase64({ message: i18nValidationMessage('validation.NOT_BASE64') })
  token: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  answer: string;

  @IsEnum(Simulator, { message: i18nValidationMessage('validation.NOT_ENUM') })
  simulator: Simulator;
}
