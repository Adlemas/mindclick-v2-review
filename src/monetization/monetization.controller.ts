import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/users/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { CreateUpdateMonetizationDto } from 'src/monetization/dto/create-update-monetization.dto';

@Controller('monetization')
export class MonetizationController {
  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post()
  createUpdateMonetization(@Body() dto: CreateUpdateMonetizationDto) {
    return dto;
  }

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete()
  resetMonetization() {
    return null;
  }
}
