import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { from, Observable, of, switchMap } from 'rxjs';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { LocaleService } from 'src/locale/locale.service';
import { Tokens } from 'src/auth/interface/tokens.interface';
import { Promise, Schema } from 'mongoose';
import { configService } from 'src/config/config.service';

@Injectable()
export class AuthService {
  @Inject(LocaleService)
  private readonly localeService: LocaleService;

  @Inject(UsersService)
  private readonly usersService: UsersService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  validateUser(
    email: string,
    pass: string,
  ): Observable<Omit<User, 'password'>> {
    return from(
      this.usersService.findOne({
        email,
      }),
    ).pipe(
      switchMap((user) => {
        if (user) {
          return from(bcrypt.compare(pass, user.password)).pipe(
            switchMap((isMatch) => {
              if (isMatch) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...result } = user.toObject();
                return of(result);
              }
              throw new BadRequestException(
                this.localeService.translate('auth.incPass'),
              );
            }),
          );
        }
        throw new NotFoundException(
          this.localeService.translate('auth.notFound'),
        );
      }),
    );
  }

  login(user: LoginDto): Observable<Tokens> {
    return from(this.validateUser(user.email, user.password)).pipe(
      switchMap((user) => {
        return this.getTokens(user._id, user.email).pipe(
          switchMap((tokens) => {
            return this.updateRefreshToken(user._id, tokens.refreshToken).pipe(
              switchMap(() => {
                return of(tokens);
              }),
            );
          }),
        );
      }),
    );
  }

  refreshTokens(
    userId: Schema.Types.ObjectId,
    refreshToken: string,
  ): Observable<Tokens> {
    return from(this.usersService.findById(userId)).pipe(
      switchMap((user) => {
        if (!user || !user.refreshToken) {
          throw new ForbiddenException(
            this.localeService.translate('errors.forbidden'),
          );
        }
        return from(bcrypt.compare(refreshToken, user.refreshToken)).pipe(
          switchMap((matches) => {
            if (!matches) {
              throw new ForbiddenException('errors.forbidden');
            }
            return this.getTokens(user._id, user.email).pipe(
              switchMap((tokens) => {
                return this.updateRefreshToken(
                  user._id,
                  tokens.refreshToken,
                ).pipe(switchMap(() => of(tokens)));
              }),
            );
          }),
        );
      }),
    );
  }

  updateRefreshToken(userId: Schema.Types.ObjectId, refreshToken: string) {
    return from(bcrypt.hash(refreshToken, 10)).pipe(
      switchMap((hash) => {
        return from(
          this.usersService.updateById(userId, { refreshToken: hash }),
        );
      }),
    );
  }

  getTokens(userId: Schema.Types.ObjectId, email: string): Observable<Tokens> {
    return from(
      Promise.all([
        this.jwtService.signAsync(
          {
            sub: userId,
            email,
          },
          {
            secret: configService.getJwtSecret(),
            expiresIn: configService.getAccessTokenExpiresIn(),
          },
        ),
        this.jwtService.signAsync(
          {
            sub: userId,
            email,
          },
          {
            secret: configService.getRefreshJwtSecret(),
            expiresIn: configService.getRefreshTokenExpiresIn(),
          },
        ),
      ]),
    ).pipe(
      switchMap(([accessToken, refreshToken]) => {
        return of({
          accessToken,
          refreshToken,
        });
      }),
    );
  }
}
