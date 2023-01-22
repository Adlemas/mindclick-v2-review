import { Inject, Injectable } from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';
import { User } from 'src/schemas/user.schema';
import { GroupRepository } from 'src/groups/repository/group.repository';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';
import { Group } from 'src/schemas/group.schema';
import { UpdateGroupDto } from 'src/groups/dto/update-group.dto';

@Injectable()
export class GroupsService {
  @Inject(GroupRepository)
  private readonly groupRepository: GroupRepository;

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
        return this.groupRepository.getUserGroups(user._id);
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
}
