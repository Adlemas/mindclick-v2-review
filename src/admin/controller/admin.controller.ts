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
import { AdminService } from 'src/admin/service/admin.service';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { AdminUserGuard } from 'src/users/guard/admin.guard';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import {
  UpdateAdminDto,
  UpdateAdminParamsDto,
} from 'src/admin/dto/update-admin.dto';
import { DeleteAdminParamsDto } from 'src/admin/dto/delete-admin.dto';
import { GetAdminsQueryDto } from 'src/admin/dto/get-admins.dto';

@Controller('admin')
export class AdminController {
  @Inject(AdminService)
  private readonly adminService: AdminService;

  @UseGuards(AccessTokenGuard, AdminUserGuard)
  @Get('users')
  getUsers(@Req() req, @Query() dto: GetAdminsQueryDto) {
    return this.adminService.getUsers(req.user, dto);
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
    return this.adminService.updateUser(req.user, id, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      address: dto.address,
      city: dto.city,
      birthDate: dto.birthDate,
      plan: dto.plan,
      description: dto.description,
      phone: dto.phone,
      status: dto.status,
    });
  }

  @UseGuards(AccessTokenGuard, AdminUserGuard)
  @Delete('users/:id')
  deleteUser(@Req() req, @Param() { id }: DeleteAdminParamsDto) {
    return this.adminService.deleteUser(req.user, id);
  }
}
