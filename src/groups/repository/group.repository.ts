import { InjectModel } from '@nestjs/mongoose';
import { Group } from 'src/schemas/group.schema';
import { Model, Schema } from 'mongoose';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';
import { from, Observable, of, switchMap } from 'rxjs';
import { UpdateGroupDto } from 'src/groups/dto/update-group.dto';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { LocaleService } from 'src/locale/locale.service';
import { RemoveGroupDto } from 'src/groups/dto/remove-group.dto';
import { UserRepository } from 'src/users/repository/user.repository';

export class GroupRepository {
  @InjectModel(Group.name)
  private readonly groupModel: Model<Group>;

  @Inject(LocaleService)
  private readonly localeService: LocaleService;

  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  createGroup(
    createGroupDto: CreateGroupDto,
    userId: Schema.Types.ObjectId,
  ): Observable<Group> {
    const group = new this.groupModel(createGroupDto);
    group.owner = userId;
    return from(group.save());
  }

  getUserGroups(userId: Schema.Types.ObjectId): Observable<Array<Group>> {
    return from(
      this.groupModel
        .find({
          owner: userId,
        })
        .exec(),
    );
  }

  findGroupById(groupId: Schema.Types.ObjectId): Observable<Group> {
    return from(this.groupModel.findById(groupId).exec());
  }

  findUserGroup(
    userId: Schema.Types.ObjectId,
    groupId: Schema.Types.ObjectId,
  ): Observable<Group | null> {
    return this.findGroupById(groupId).pipe(
      switchMap((group) => {
        if (group && group.owner.toString() === userId.toString()) {
          return of(group);
        }
        return of(null);
      }),
    );
  }

  updateGroupById(
    groupId: Schema.Types.ObjectId,
    updateGroupDto: UpdateGroupDto,
  ) {
    return from(
      this.groupModel.findByIdAndUpdate(groupId, updateGroupDto, {
        new: true,
      }),
    );
  }

  updateGroupByOwner(
    userId: Schema.Types.ObjectId,
    updateGroupDto: UpdateGroupDto,
  ): Observable<Group> {
    return this.findUserGroup(userId, updateGroupDto.groupId).pipe(
      switchMap((group) => {
        if (!group) {
          throw new NotFoundException(
            this.localeService.translate('errors.group_not_found'),
          );
        }
        return this.updateGroupById(group._id, updateGroupDto);
      }),
    );
  }

  getGroupMemberCount(groupId: Schema.Types.ObjectId) {
    return from(this.userRepository.getGroupUsersCount(groupId));
  }

  removeGroupById(
    userId: Schema.Types.ObjectId,
    groupId: Schema.Types.ObjectId,
    removeGroupDto: RemoveGroupDto,
  ) {
    return this.findUserGroup(userId, groupId).pipe(
      switchMap((group) => {
        if (!group) {
          throw new NotFoundException(
            this.localeService.translate('errors.group_not_found'),
          );
        }
        return from(this.getGroupMemberCount(groupId)).pipe(
          switchMap((count) => {
            if (count > 0 && !removeGroupDto.newGroupId) {
              throw new ForbiddenException(
                this.localeService.translate('errors.group_not_empty'),
              );
            }
            if (count > 0 && removeGroupDto.newGroupId) {
              return this.userRepository
                .moveAllUsersToGroup(userId, groupId, removeGroupDto.newGroupId)
                .pipe(
                  switchMap(() => {
                    return from(
                      this.groupModel.findByIdAndDelete(groupId).exec(),
                    );
                  }),
                );
            }
            return from(this.groupModel.findByIdAndDelete(groupId).exec());
          }),
        );
      }),
    );
  }
}
