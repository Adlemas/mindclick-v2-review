import { IsNumber, IsOptional, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  @Type(() => Number)
  page: number;

  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @Min(0, { message: i18nValidationMessage('validation.MIN') })
  @Type(() => Number)
  @IsOptional()
  size?: number;
}
