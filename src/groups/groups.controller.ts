import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
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

@Controller('groups')
export class GroupsController {
  @Inject(GroupsService)
  private readonly groupsService: GroupsService;

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post()
  addGroup(@Req() req, @Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.addGroup(createGroupDto, req.user);
  }

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get()
  getMyGroups(@Req() req) {
    return this.groupsService.getUserGroups(req.user);
  }

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Put()
  updateGroup(@Req() req, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.updateGroupByOwner(req.user, updateGroupDto);
  }
}
