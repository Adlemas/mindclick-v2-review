import { MultiplyPayloadDto } from 'src/expression/dto/mutliply-payload.dto';
import { IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class MultiplyDocumentPayloadDto extends MultiplyPayloadDto {
  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  rows: number;

  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  columns: number;
}
