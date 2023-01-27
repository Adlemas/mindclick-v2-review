import { IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { DividePayloadDto } from 'src/expression/dto/divide-payload.dto';

export class DivideDocumentPayloadDto extends DividePayloadDto {
  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  rows: number;

  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  columns: number;
}
