import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { GroupsService } from 'src/groups/groups.service';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { Roles } from 'src/users/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';

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
}
