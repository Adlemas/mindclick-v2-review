import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import {
  IsBooleanString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Simulator } from 'src/enum/simulator.enum';
import { Schema } from 'mongoose';
import { Order } from 'src/enum/order.enum';

export class GetTasksQueryDto extends PaginationQueryDto {
  @IsBooleanString({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  @IsOptional()
  completed?: boolean;

  @IsEnum(Simulator, { message: i18nValidationMessage('validation.NOT_ENUM') })
  @IsOptional()
  simulator?: Simulator;

  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  assignedTo?: Schema.Types.ObjectId;

  @IsEnum(Order, {
    message: i18nValidationMessage('validation.NOT_ENUM'),
  })
  @IsOptional()
  order?: 'asc' | 'desc';
}
