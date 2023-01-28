import mongoose, {
  HydratedDocument,
  now,
  Schema as MongooseSchema,
} from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/enum/role.enum';
import { Portfolio } from 'src/interface/portfolio.interface';
import { Monetization } from 'src/interface/monetization.interface';
import { Plan } from 'src/interface/plan.interface';
import { Group } from 'src/schemas/group.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
  },
})
export class User {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({
    type: String,
    default: null,
  })
  phone: string | null;

  @Prop({
    type: Date,
    default: null,
  })
  lastLogin: Date | null;

  @Prop({
    type: String,
    default: null,
  })
  profileImg: string | null;

  @Prop({
    type: Number,
    default: 0,
  })
  rate: number;

  @Prop({
    type: Number,
    default: 0,
  })
  points: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  status: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  birthDate: Date | null;

  @Prop({
    type: [String],
    default: [],
  })
  device: Array<string>;

  @Prop({
    type: String,
    required: true,
    enum: Role,
    default: Role.STUDENT,
  })
  role: Role;

  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: String,
    default: null,
  })
  description: string | null;

  @Prop({
    type: String,
    default: null,
  })
  city: string | null;

  @Prop({
    type: String,
    default: null,
  })
  address: string | null;

  @Prop({
    type: [
      raw({
        filename: { type: String },
        displayName: { type: String },
        uploadAt: { type: Date },
      }),
    ],
    default: [],
  })
  portfolio: Array<Portfolio>;

  // centres: Array<Centre>;

  @Prop({
    type: Number,
    default: 3,
  })
  maxGroups: number;

  @Prop({
    type: raw({
      ignoreSimulators: { type: [String] },
      factor: { type: Number },
    }),
    default: null,
  })
  monetization: Monetization | null;

  @Prop({
    type: raw({
      id: { type: String },
      name: { type: String },
      price: { type: Number },
      maxMembers: { type: Number },
    }),
    default: null,
  })
  plan: Plan | null;

  @Prop({
    type: Number,
    default: 0,
  })
  balance: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  isAdmin: boolean;

  @Prop({
    default: now(),
  })
  createdAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Group.name,
  })
  group: mongoose.Schema.Types.ObjectId;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
