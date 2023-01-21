import { Controller, Inject, Post, Request } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }
}
