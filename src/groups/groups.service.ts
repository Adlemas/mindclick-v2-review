import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { from, Observable, switchMap } from 'rxjs';
import { User } from 'src/schemas/user.schema';
import { GroupRepository } from 'src/groups/repository/group.repository';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';
import { Group } from 'src/schemas/group.schema';
import { UpdateGroupDto } from 'src/groups/dto/update-group.dto';
import { Schema } from 'mongoose';
import { RemoveGroupDto } from 'src/groups/dto/remove-group.dto';
import { UsersService } from 'src/users/users.service';
import { LocaleService } from 'src/locale/locale.service';
import { Role } from 'src/enum/role.enum';

@Injectable()
export class GroupsService {
  @Inject(GroupRepository)
  private readonly groupRepository: GroupRepository;

  @Inject(UsersService)
  private readonly usersService: UsersService;

  @Inject(LocaleService)
  private readonly localeService: LocaleService;

  addGroup(
    createGroupDto: CreateGroupDto,
    user: Observable<User>,
  ): Observable<Group> {
    return user.pipe(
      switchMap((user) => {
        return this.groupRepository.createGroup(createGroupDto, user._id);
      }),
    );
  }

  getUserGroups(user: Observable<User>) {
    return user.pipe(
      switchMap((user) => {
        if (user.role === Role.TEACHER) {
          return this.groupRepository.getUserGroups(user._id);
        }
        if (user.role === Role.STUDENT) {
          return this.groupRepository.getGroup(user.group);
        }
        throw new ForbiddenException(
          this.localeService.translate('errors.forbidden'),
        );
      }),
    );
  }

  updateGroupByOwner(user: Observable<User>, updateGroupDto: UpdateGroupDto) {
    return user.pipe(
      switchMap((user) => {
        return this.groupRepository.updateGroupByOwner(
          user._id,
          updateGroupDto,
        );
      }),
    );
  }

  getGroupMemberCount(groupId: Schema.Types.ObjectId) {
    return from(this.usersService.getGroupUsersCount(groupId));
  }

  removeGroupByOwner(
    user: Observable<User>,
    groupId: Schema.Types.ObjectId,
    removeGroupDto: RemoveGroupDto,
  ) {
    return user.pipe(
      switchMap((user) => {
        return this.groupRepository.findUserGroup(user._id, groupId).pipe(
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
                  return this.usersService
                    .moveAllUsersToGroup(
                      user._id,
                      groupId,
                      removeGroupDto.newGroupId,
                    )
                    .pipe(
                      switchMap(() => {
                        return this.groupRepository.removeGroupById(groupId);
                      }),
                    );
                }
                return this.groupRepository.removeGroupById(groupId);
              }),
            );
          }),
        );
      }),
    );
  }
}
