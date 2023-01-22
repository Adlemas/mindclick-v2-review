import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { from, Observable, of, switchMap } from 'rxjs';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'src/auth/interface/payload.interface';
import { LoginDto } from 'src/auth/dto/login.dto';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  @Inject(UsersService)
  private readonly usersService: UsersService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  validateUser(
    email: string,
    pass: string,
  ): Observable<Omit<User, 'password'>> {
    const i18n = I18nContext.current();
    return from(this.usersService.findOne(email)).pipe(
      switchMap((user) => {
        if (user && user.password === pass) {
          return from(bcrypt.compare(pass, user.password)).pipe(
            switchMap((isMatch) => {
              if (isMatch) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...result } = user;
                return of(result);
              }
              return of(null);
            }),
          );
        }
        throw new NotFoundException(i18n.t('auth.notFound'));
      }),
    );
  }

  login(user: LoginDto): Observable<any> {
    return from(this.validateUser(user.email, user.password)).pipe(
      switchMap((user) => {
        const payload: Payload = {
          email: user.email,
          sub: user._id.toString(),
        };
        return of(payload);
      }),
    );
  }
}
