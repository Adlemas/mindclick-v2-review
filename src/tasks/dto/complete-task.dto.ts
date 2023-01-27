import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Schema } from 'mongoose';

export class CompleteTaskParamsDto {
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  id: Schema.Types.ObjectId;
}

export class CompleteTaskDto {
  @IsNumber(
    {},
    {
      each: true,
      message: i18nValidationMessage('validation.NOT_NUMBER_ARRAY'),
    },
  )
  expression: number[];

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  your: string;

  @IsBoolean({ message: i18nValidationMessage('validation.NOT_BOOLEAN') })
  isRight: boolean;

  @IsObject({ message: i18nValidationMessage('validation.NOT_OBJECT') })
  settings: any;
}
