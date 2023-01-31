import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetMembersDto extends PaginationQueryDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  @IsOptional()
  groupId?: string;
}
