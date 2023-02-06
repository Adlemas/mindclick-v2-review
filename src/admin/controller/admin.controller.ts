import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';
import { AdminService } from 'src/admin/service/admin.service';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { AdminUserGuard } from 'src/users/guard/admin.guard';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';

@Controller('admin')
export class AdminController {
  @Inject(AdminService)
  private readonly adminService: AdminService;

  @UseGuards(AccessTokenGuard, AdminUserGuard)
  @Get('users')
  getUsers(@Req() req, @Query() paginationDto: PaginationQueryDto) {
    return this.adminService.getUsers(req.user, paginationDto);
  }
}
