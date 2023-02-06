import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PlanType } from 'src/enum/plan.enum';

export class GetAdminsQueryDto extends PaginationQueryDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  query?: string;

  // status?: string;
  @IsBooleanString({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  @IsOptional()
  status?: boolean;

  // plan?: string;
  @IsEnum(PlanType, { message: i18nValidationMessage('validation.NOT_ENUM') })
  @IsOptional()
  plan?: PlanType;
}
