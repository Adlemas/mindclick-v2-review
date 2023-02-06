import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type GroupDocument = HydratedDocument<any>;

@Schema({
  timestamps: true,
})
export class Group {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: Number,
    default: 10,
  })
  maxMembers: number;

  /**
   * Color of the group
   * default is null
   */
  @Prop({
    type: String,
    default: undefined,
  })
  color?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  owner: mongoose.Schema.Types.ObjectId;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
