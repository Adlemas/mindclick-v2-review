import {
  IsEnum,
  IsISO8601,
  IsMongoId,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { Simulator } from 'src/enum/simulator.enum';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Schema } from 'mongoose';

export class CreateTaskDto {
  @IsEnum(Simulator, { message: i18nValidationMessage('validation.NOT_ENUM') })
  simulator: Simulator;

  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  count: number;

  // ISO date - expiresAt: string;
  @IsISO8601(
    { strict: true },
    { message: i18nValidationMessage('validation.NOT_DATE') },
  )
  expiresAt: string;

  @IsObject({ message: i18nValidationMessage('validation.NOT_OBJECT') })
  settings: object;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  assignedTo: Schema.Types.ObjectId;
}

export class CreateTaskDtoWithOwner extends CreateTaskDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  createdBy: Schema.Types.ObjectId;
}
