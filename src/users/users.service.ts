import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { from, Observable, of, switchMap } from 'rxjs';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserRepository } from 'src/users/repository/user.repository';
import { FilterQuery, isValidObjectId, Schema } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocaleService } from 'src/locale/locale.service';
import { Role } from 'src/enum/role.enum';
import { Rank } from 'src/users/interface/rank.interface';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { UpdateAdminDto } from 'src/admin/dto/update-admin.dto';

@Injectable()
export class UsersService {
  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  @Inject(LocaleService)
  private readonly localeService: LocaleService;

  findOne(filter: Partial<User>, withPassword = false) {
    return this.userRepository.findOne(filter, withPassword);
  }

  find(filter: FilterQuery<User>, pagination: PaginationQueryDto) {
    return this.userRepository.getWithPagination(filter, pagination);
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
    user: Observable<User> | Schema.Types.ObjectId, // userId
    userId: Schema.Types.ObjectId | UpdateUserDto, // updateUserDto
    updateUserDto?: UpdateUserDto,
  ) {
    if (isValidObjectId(user) || typeof user === 'string') {
      return from(
        this.userRepository.updateById(user as Schema.Types.ObjectId, {
          ...(userId as UpdateUserDto),
          groupId: undefined,
        }),
      );
    }
    return (user as Observable<User>).pipe(
      switchMap((user) => {
        return from(
          this.userRepository.getUserTeacher(userId as Schema.Types.ObjectId),
        ).pipe(
          switchMap((teacher) => {
            if (teacher._id.toString() !== user._id.toString()) {
              throw new ForbiddenException(
                this.localeService.translate('errors.forbidden'),
              );
            }
            return from(
              this.userRepository.updateById(
                userId as Schema.Types.ObjectId,
                updateUserDto,
              ),
            ).pipe(
              switchMap(() => {
                return from(
                  this.userRepository.moveUserToGroup(
                    user._id,
                    userId as Schema.Types.ObjectId,
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

  updateByIdWithoutGroup(
    userId: Schema.Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ) {
    return this.userRepository.updateById(userId, updateUserDto);
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

  updateTeacher(userId: Schema.Types.ObjectId, dto: UpdateAdminDto) {
    return this.userRepository.updateTeacher(userId, dto);
  }

  deleteTeacher(userId: Schema.Types.ObjectId) {
    return this.userRepository.deleteTeacher(userId);
  }

  createTeacher(dto: CreateAdminDto) {
    return this.userRepository.createTeacher(dto);
  }

  getMyRank(user: Observable<User>): Observable<Rank> {
    return user.pipe(
      switchMap((user) => {
        if (user.role === Role.STUDENT) {
          return of({
            rate: user.rate,
            points: user.points,
          });
        }
        if (user.role === Role.TEACHER) {
          return this.userRepository.getUserGroups(user._id).pipe(
            switchMap((groups) => {
              return from(this.userRepository.getGroupsRank(groups)).pipe(
                switchMap((rates) => {
                  return of({
                    rate: rates.reduce((sum, curr) => sum + curr.rate, 0),
                    points: rates.reduce((sum, curr) => sum + curr.points, 0),
                  });
                }),
              );
            }),
          );
        }
        throw new ForbiddenException(
          this.localeService.translate('errors.forbidden'),
        );
      }),
    );
  }
}
