import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model, Schema } from 'mongoose';
import { from, Observable, switchMap } from 'rxjs';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class UsersService {
  @InjectModel(User.name) private userModel: Model<UserDocument>;

  findOne(email: string): Observable<UserDocument> {
    return from(this.userModel.findOne({ email }).exec());
  }

  findById(id: string): Observable<UserDocument> {
    return from(this.userModel.findById(id).exec());
  }

  updateOne(
    id: Schema.Types.ObjectId,
    data: UpdateUserDto,
  ): Observable<UserDocument> {
    return from(
      this.userModel
        .findByIdAndUpdate(id, data, {
          new: true,
        })
        .exec(),
    );
  }

  update(user: User | Observable<User>, dto: UpdateUserDto) {
    if (user instanceof Observable) {
      return user.pipe(
        switchMap((u) => {
          return this.updateOne(u._id, dto);
        }),
      );
    }
    return this.updateOne(user._id, user);
  }
}
