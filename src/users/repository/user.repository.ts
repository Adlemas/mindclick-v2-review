import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model, Schema } from 'mongoose';
import { from, Observable } from 'rxjs';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class UserRepository {
  @InjectModel(User.name)
  private readonly userModel: Model<User>;

  findOne(filter: Partial<User>): Observable<UserDocument> {
    return from(this.userModel.findOne(filter).exec());
  }

  findById(userId: Schema.Types.ObjectId): Observable<User> {
    return from(this.userModel.findById(userId).exec());
  }

  updateById(
    userId: Schema.Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Observable<User> {
    return from(
      this.userModel
        .findByIdAndUpdate(userId, updateUserDto, {
          new: true,
        })
        .exec(),
    );
  }
}
