import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from 'src/groups/groups.service';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { Roles } from 'src/users/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';
import { UpdateGroupDto } from 'src/groups/dto/update-group.dto';
import {
  RemoveGroupDto,
  RemoveGroupParamsDto,
} from 'src/groups/dto/remove-group.dto';
import { GetMembersDto } from 'src/groups/dto/get-members.dto';

@Controller('groups')
export class GroupsController {
  @Inject(GroupsService)
  private readonly groupsService: GroupsService;

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post()
  addGroup(@Req() req, @Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.addGroup(
      {
        name: createGroupDto.name,
        color: createGroupDto.color,
      },
      req.user,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  getMyGroups(@Req() req) {
    return this.groupsService.getUserGroups(req.user);
  }

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('members')
  getMembers(@Req() req, @Query() dto: GetMembersDto) {
    return this.groupsService.getMembers(req.user, dto);
  }

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Put()
  updateGroup(@Req() req, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.updateGroupByOwner(req.user, {
      groupId: updateGroupDto.groupId,
      name: updateGroupDto.name,
    });
  }

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete(':groupId')
  removeGroup(
    @Req() req,
    @Param() { groupId }: RemoveGroupParamsDto,
    @Body() removeGroupDto: RemoveGroupDto,
  ) {
    return this.groupsService.removeGroupByOwner(req.user, groupId, {
      newGroupId: removeGroupDto.newGroupId,
    });
  }
}
