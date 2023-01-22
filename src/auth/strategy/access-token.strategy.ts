import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configService } from 'src/config/config.service';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { from, of, switchMap } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  @Inject(UsersService)
  private readonly usersService: UsersService;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtSecret(),
    });
  }

  validate(payload: JwtPayload) {
    return from(this.usersService.findOne(payload.email)).pipe(
      switchMap((user) => {
        if (user) {
          return of(user);
        }
        throw new Error('User not found');
      }),
    );
  }
}
