import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';
import { Schema } from 'mongoose';
import { Monetization } from 'src/interface/monetization.interface';
import { CityDto } from 'src/interface/city.dto';

export class UpdateUserParamDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  id: Schema.Types.ObjectId;
}

export class UpdateUserDto {
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  firstName?: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  lastName?: string;

  @IsPhoneNumber(undefined, {
    message: i18nValidationMessage('validation.NOT_PHONE_NUMBER'),
  })
  @IsOptional()
  phone?: string;

  @Type(() => Date)
  @IsDate({ message: i18nValidationMessage('validation.NOT_DATE') })
  @IsOptional()
  birthDate?: Date;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  description?: string;

  @IsOptional()
  @Type(() => CityDto)
  @ValidateNested()
  city?: CityDto;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsOptional()
  address?: string;

  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @IsMongoId({ message: i18nValidationMessage('validation.NOT_MONGO_ID') })
  @IsOptional()
  groupId?: Schema.Types.ObjectId;

  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @IsOptional()
  rate?: number;

  @IsNumber({}, { message: i18nValidationMessage('validation.NOT_NUMBER') })
  @IsOptional()
  points?: number;

  refreshToken?: string;
  monetization?: Monetization;
  lastLogin?: Date;
}
