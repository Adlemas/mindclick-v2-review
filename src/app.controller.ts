import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  getProfile(@Request() req) {
    return this.appService.getProfile(req.user);
  }
}
