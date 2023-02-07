import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CityDocument = HydratedDocument<City>;

@Schema()
export class City {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
  })
  region: string;

  @Prop({
    type: String,
  })
  city: string;
}

export const CitySchema = SchemaFactory.createForClass(City);
