import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  _id: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class TaskStat {
  @Prop({ type: [Number], required: true })
  expression: number[];

  @Prop({ type: String, required: true })
  your: string;

  @Prop({ type: Boolean, required: true })
  isRight: boolean;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  settings: any;
}

export const TaskStatSchema = SchemaFactory.createForClass(TaskStat);
