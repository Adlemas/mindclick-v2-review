import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { from, Observable, switchMap } from 'rxjs';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserRepository } from 'src/users/repository/user.repository';
import { Schema } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocaleService } from 'src/locale/locale.service';

@Injectable()
export class UsersService {
  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  @Inject(LocaleService)
  private readonly localeService: LocaleService;

  findOne(filter: Partial<User>) {
    return this.userRepository.findOne(filter);
  }

  findById(userId: Schema.Types.ObjectId) {
    return this.userRepository.findById(userId);
  }

  remove(user: Observable<User>, userId: Schema.Types.ObjectId) {
    return user.pipe(
      switchMap((u) => {
        return from(this.userRepository.getUserTeacher(userId)).pipe(
          switchMap((teacher) => {
            if (teacher._id.toString() !== u._id.toString()) {
              throw new ForbiddenException(
                this.localeService.translate('errors.forbidden'),
              );
            }
            return from(this.userRepository.removeUser(userId));
          }),
        );
      }),
    );
  }

  updateById(
    user: Observable<User>,
    userId: Schema.Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ) {
    if (!updateUserDto.groupId)
      return this.userRepository.updateById(userId, updateUserDto);
    return user.pipe(
      switchMap((user) => {
        return from(this.userRepository.getUserTeacher(userId)).pipe(
          switchMap((teacher) => {
            if (teacher._id.toString() !== user._id.toString()) {
              throw new ForbiddenException(
                this.localeService.translate('errors.forbidden'),
              );
            }
            return from(
              this.userRepository.updateById(userId, updateUserDto),
            ).pipe(
              switchMap((user) => {
                return from(
                  this.userRepository.moveUserToGroup(
                    user._id,
                    userId,
                    updateUserDto.groupId,
                  ),
                );
              }),
            );
          }),
        );
      }),
    );
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

  getGroupUsersCount(groupId: Schema.Types.ObjectId) {
    return this.userRepository.getGroupUsersCount(groupId);
  }

  moveAllUsersToGroup(
    userId: Schema.Types.ObjectId,
    groupId: Schema.Types.ObjectId,
    targetGroupId: Schema.Types.ObjectId,
  ) {
    return this.userRepository.moveAllUsersToGroup(
      userId,
      groupId,
      targetGroupId,
    );
  }

  create(user: Observable<User>, dto: CreateUserDto) {
    return user.pipe(
      switchMap((u) => {
        return this.userRepository.createUser(u._id, dto);
      }),
    );
  }
}
