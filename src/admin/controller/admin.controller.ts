import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from 'src/admin/service/admin.service';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { AdminUserGuard } from 'src/users/guard/admin.guard';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import {
  UpdateAdminDto,
  UpdateAdminParamsDto,
} from 'src/admin/dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  @Inject(AdminService)
  private readonly adminService: AdminService;

  @UseGuards(AccessTokenGuard, AdminUserGuard)
  @Get('users')
  getUsers(@Req() req, @Query() paginationDto: PaginationQueryDto) {
    return this.adminService.getUsers(req.user, paginationDto);
  }

  @UseGuards(AccessTokenGuard, AdminUserGuard)
  @Post('users')
  createUser(@Req() req, @Body() dto: CreateAdminDto) {
    return this.adminService.createUser(req.user, dto);
  }

  @UseGuards(AccessTokenGuard, AdminUserGuard)
  @Put('users/:id')
  updateUser(
    @Req() req,
    @Param() { id }: UpdateAdminParamsDto,
    @Body() dto: UpdateAdminDto,
  ) {
    return this.adminService.updateUser(req.user, id, dto);
  }
}
