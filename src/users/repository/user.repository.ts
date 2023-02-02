import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { FilterQuery, Model, Schema } from 'mongoose';
import { from, Observable, of, switchMap } from 'rxjs';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { GroupRepository } from 'src/groups/repository/group.repository';
import { LocaleService } from 'src/locale/locale.service';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enum/role.enum';
import { Group } from 'src/schemas/group.schema';
import { Rank } from 'src/users/interface/rank.interface';
import { PaginationService } from 'src/pagination/pagination.service';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/interface/paginated-response.interface';

@Injectable()
export class UserRepository {
  @InjectModel(User.name)
  private readonly userModel: Model<User>;

  @Inject(GroupRepository)
  private readonly groupRepository: GroupRepository;

  @Inject(LocaleService)
  private readonly localeService: LocaleService;

  @Inject(PaginationService)
  private readonly paginationService: PaginationService;

  createUser(
    userId: Schema.Types.ObjectId,
    createUserDto: CreateUserDto,
  ): Observable<Omit<User, 'password'>> {
    return from(this.userModel.findOne({ email: createUserDto.email })).pipe(
      switchMap((userExists) => {
        if (userExists) {
          throw new ForbiddenException(
            this.localeService.translate('errors.email_exists'),
          );
        }
        return from(
          this.groupRepository.findUserGroup(userId, createUserDto.groupId),
        ).pipe(
          switchMap((group) => {
            if (!group) {
              throw new ForbiddenException(
                this.localeService.translate('errors.forbidden'),
              );
            }
            return from(bcrypt.hash(createUserDto.password, 10)).pipe(
              switchMap((hashedPassword) => {
                return from(
                  this.userModel.create({
                    ...createUserDto,
                    password: hashedPassword,
                    role: Role.STUDENT,
                    groupId: group._id,
                  }),
                ).pipe(
                  switchMap((createdUser) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { password, ...user } = createdUser.toObject();
                    return of(user);
                  }),
                );
              }),
            );
          }),
        );
      }),
    );
  }

  getWithPagination(
    filter: FilterQuery<User>,
    pagination: PaginationQueryDto,
  ): Observable<PaginatedResponse<Array<User>>> {
    return from(
      this.paginationService.paginate(this.userModel, pagination, {
        filter,
      }),
    );
  }

  getUserTeacher(userId: Schema.Types.ObjectId): Observable<User> {
    return from(this.userModel.findById(userId).exec()).pipe(
      switchMap((user) => {
        if (!user) {
          throw new ForbiddenException(
            this.localeService.translate('errors.forbidden'),
          );
        }
        if (user.role !== Role.STUDENT) {
          throw new ForbiddenException(
            this.localeService.translate('errors.forbidden'),
          );
        }
        return from(this.groupRepository.findGroupById(user.groupId)).pipe(
          switchMap((group) => {
            if (!group) {
              throw new ForbiddenException(
                this.localeService.translate('errors.forbidden'),
              );
            }
            return from(this.userModel.findById(group.owner).exec());
          }),
        );
      }),
    );
  }

  removeUser(userId: Schema.Types.ObjectId): Observable<User> {
    return from(this.userModel.findByIdAndDelete(userId).exec());
  }

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

  getGroupUsersCount(groupId: Schema.Types.ObjectId): Observable<number> {
    return from(
      this.userModel
        .count({
          groupId: groupId,
        })
        .exec(),
    );
  }

  moveUserToGroup(
    userId: Schema.Types.ObjectId,
    targetUserId: Schema.Types.ObjectId,
    groupId: Schema.Types.ObjectId,
  ): Observable<User> {
    return from(this.findById(targetUserId)).pipe(
      switchMap((targetUser) => {
        if (!targetUser) {
          throw new ForbiddenException(
            this.localeService.translate('errors.user_not_found'),
          );
        }
        return from(this.groupRepository.getUserGroups(userId)).pipe(
          switchMap((groups) => {
            console.log(targetUser);
            if (
              !groups.some(
                (group) =>
                  group._id.toString() === targetUser.groupId.toString(),
              ) ||
              !groups.some(
                (group) => group._id.toString() === groupId.toString(),
              )
            ) {
              throw new ForbiddenException(
                this.localeService.translate('errors.forbidden'),
              );
            }
            return from(
              this.userModel.findByIdAndUpdate(
                targetUserId,
                {
                  group: groupId,
                },
                {
                  new: true,
                },
              ),
            );
          }),
        );
      }),
    );
  }

  moveAllUsersToGroup(
    userId: Schema.Types.ObjectId,
    groupId: Schema.Types.ObjectId,
    targetGroupId: Schema.Types.ObjectId,
  ) {
    return from(this.groupRepository.getUserGroups(userId)).pipe(
      switchMap((groups) => {
        if (
          !groups.some(
            (group) => group._id.toString() === groupId.toString(),
          ) ||
          !groups.some(
            (group) => group._id.toString() === targetGroupId.toString(),
          )
        ) {
          throw new ForbiddenException(
            this.localeService.translate('errors.forbidden'),
          );
        }
        return from(
          this.userModel
            .updateMany(
              {
                groupId: groupId,
              },
              {
                group: targetGroupId,
              },
              {
                new: true,
              },
            )
            .exec(),
        );
      }),
    );
  }

  getUserGroups(userId: Schema.Types.ObjectId): Observable<Array<Group>> {
    return this.groupRepository.getUserGroups(userId);
  }

  getGroupsRank(groups: Array<Group>): Observable<Array<Rank>> {
    return from(
      this.userModel
        .find(
          { groupId: { $in: groups.map((g) => g._id) } },
          { rate: 1, points: 1 },
        )
        .exec(),
    );
  }
}
