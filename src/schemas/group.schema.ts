import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/schemas/user.schema';

export type GroupDocument = HydratedDocument<any>;

@Schema({
  timestamps: true,
})
export class Group {
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

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  members: Array<User>;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
