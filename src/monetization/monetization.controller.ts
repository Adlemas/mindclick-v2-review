import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/users/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { CreateUpdateMonetizationDto } from 'src/monetization/dto/create-update-monetization.dto';
import { MonetizationService } from 'src/monetization/monetization.service';

@Controller('monetization')
export class MonetizationController {
  @Inject(MonetizationService)
  private readonly monetizationService: MonetizationService;

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get()
  getMonetization(@Req() req) {
    return this.monetizationService.getMonetization(req.user);
  }

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
