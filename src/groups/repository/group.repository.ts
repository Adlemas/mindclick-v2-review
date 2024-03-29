import { InjectModel } from '@nestjs/mongoose';
import { Group } from 'src/schemas/group.schema';
import { Model, Schema } from 'mongoose';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';
import { from, Observable, of, switchMap } from 'rxjs';
import { UpdateGroupDto } from 'src/groups/dto/update-group.dto';
import { Inject, NotFoundException } from '@nestjs/common';
import { LocaleService } from 'src/locale/locale.service';

export class GroupRepository {
  @InjectModel(Group.name)
  private readonly groupModel: Model<Group>;

  @Inject(LocaleService)
  private readonly localeService: LocaleService;

  createGroup(
    createGroupDto: CreateGroupDto,
    userId: Schema.Types.ObjectId,
  ): Observable<Group> {
    const group = new this.groupModel(createGroupDto);
    group.owner = userId;
    return from(group.save());
  }

  getGroup(groupId: Schema.Types.ObjectId): Observable<Group> {
    return from(this.groupModel.findById(groupId).exec());
  }

  getUserGroups(userId: Schema.Types.ObjectId): Observable<Array<Group>> {
    return from(
      this.groupModel
        .find({
          owner: userId,
        })
        .sort({ createdAt: -1 })
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

  removeGroupById(groupId: Schema.Types.ObjectId) {
    return from(this.groupModel.findByIdAndDelete(groupId).exec());
  }
}
