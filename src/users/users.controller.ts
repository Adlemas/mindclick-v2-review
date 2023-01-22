import { Body, Controller, Inject, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { Observable } from 'rxjs';
import { User } from 'src/schemas/user.schema';

@Controller('users')
export class UsersController {
  @Inject(UsersService)
  private readonly usersService: UsersService;

  @UseGuards(AccessTokenGuard)
  @Put()
  async update(@Req() req, @Body() dto: UpdateUserDto) {
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
}
