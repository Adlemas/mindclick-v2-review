import { IsNumber, IsOptional, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PaginationQueryDto {
  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  page: number;

  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @Min(0, { message: i18nValidationMessage('validation.MIN') })
  @IsOptional()
  size?: number;
}
