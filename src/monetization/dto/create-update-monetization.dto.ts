import { IsEnum, IsNumber, Min } from 'class-validator';
import { Simulator } from 'src/enum/simulator.enum';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUpdateMonetizationDto {
  @IsEnum(Simulator, {
    each: true,
    message: i18nValidationMessage('validation.NOT_ENUM'),
  })
  ignoreSimulators: Array<Simulator>;

  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @Min(0.1, { message: i18nValidationMessage('validation.MIN') })
  factor: number;
}
