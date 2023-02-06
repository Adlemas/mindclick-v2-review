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
import { Type } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: {
    virtuals: true,
    getters: true,
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

  // updatedAt: Date;
  @Prop({
    type: Date,
    default: null,
  })
  updatedAt: Date | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Group.name,
  })
  groupId: mongoose.Schema.Types.ObjectId;

  @Prop()
  refreshToken?: string;

  @Type(() => Group)
  group: Group;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    default: null,
  })
  createdBy: mongoose.Schema.Types.ObjectId | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Virtual for group fetching by group id and populating it
UserSchema.virtual('group', {
  ref: Group.name,
  localField: 'groupId',
  foreignField: '_id',
  justOne: true,
});

UserSchema.pre(['findOne', 'find'], function (this: any, next) {
  this.populate('group');
  next();
});

UserSchema.pre(
  [
    'findOne',
    'find',
    'findOneAndDelete',
    'findOneAndReplace',
    'findOneAndRemove',
    'findOneAndUpdate',
    'updateOne',
    'update',
    'updateMany',
  ],
  function (this: any, next) {
    if (!this.options.withPassword) {
      // remove password field
      this.select('-password');
    }
    next();
  },
);
