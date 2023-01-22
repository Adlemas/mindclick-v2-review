import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import {
  UpdateUserDto,
  UpdateUserParamDto,
} from 'src/users/dto/update-user.dto';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { Observable } from 'rxjs';
import { User } from 'src/schemas/user.schema';
import { Roles } from 'src/users/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller()
export class UsersController {
  @Inject(UsersService)
  private readonly usersService: UsersService;

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard)
  @Post('users')
  create(@Req() req, @Body() dto: CreateUserDto) {
    return this.usersService.create(req.user, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Put('myprofile')
  update(@Req() req, @Body() dto: UpdateUserDto) {
    const user = req.user as Observable<User>;
    return this.usersService.update(user, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: dto.birthDate,
      city: dto.city,
      address: dto.address,
      description: dto.description,
      phone: dto.phone,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get('myprofile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Put('users/:id')
  updateById(@Param() { id }: UpdateUserParamDto, @Body() dto: UpdateUserDto) {
    return this.usersService.updateById(id, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: dto.birthDate,
      phone: dto.phone,
    });
  }
}
