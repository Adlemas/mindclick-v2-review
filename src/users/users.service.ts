import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { Observable, switchMap } from 'rxjs';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserRepository } from 'src/users/repository/user.repository';
import { Schema } from 'mongoose';

@Injectable()
export class UsersService {
  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  findOne(filter: Partial<User>) {
    return this.userRepository.findOne(filter);
  }

  findById(userId: Schema.Types.ObjectId) {
    return this.userRepository.findById(userId);
  }

  updateById(userId: Schema.Types.ObjectId, updateUserDto: UpdateUserDto) {
    return this.userRepository.updateById(userId, updateUserDto);
  }

  update(user: User | Observable<User>, dto: UpdateUserDto) {
    if (user instanceof Observable) {
      return user.pipe(
        switchMap((u) => {
          return this.userRepository.updateById(u._id, dto);
        }),
      );
    }
    return this.userRepository.updateById(user._id, user);
  }
}
