import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Simulator } from 'src/enum/simulator.enum';
import { TaskStat, TaskStatSchema } from 'src/schemas/task-stat.schema';
import { User } from 'src/schemas/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: true,
})
export class Task {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  completed: boolean;

  @Prop({ type: String, required: true, enum: Simulator })
  simulator: Simulator;

  @Prop({ type: [TaskStatSchema], default: [] })
  stats: TaskStat[];

  @Prop({ type: Number, required: true })
  count: number;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  settings: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  assignedTo: mongoose.Schema.Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
