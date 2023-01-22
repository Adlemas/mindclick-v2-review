import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';

@Injectable()
export class UsersService {
  @InjectModel(User.name) private userModel: Model<UserDocument>;

  findOne(email: string): Observable<UserDocument> {
    return from(this.userModel.findOne({ email }).exec());
  }

  findById(id: string): Observable<UserDocument> {
    return from(this.userModel.findById(id).exec());
  }

  updateOne(id: string, data: Partial<User>): Observable<UserDocument> {
    return from(this.userModel.findByIdAndUpdate(id, data).exec());
  }
}
