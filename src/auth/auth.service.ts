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
      this.usersService.findOne(
        {
          email,
        },
        true,
      ),
    ).pipe(
      switchMap((user) => {
        if (user) {
          return from(bcrypt.compare(pass, user.password)).pipe(
            switchMap((isMatch) => {
              if (isMatch) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...result } = user.toObject();
                return from(
                  this.usersService.updateByIdWithoutGroup(user._id, {
                    lastLogin: new Date(),
                  }),
                ).pipe(
                  switchMap(() => {
                    return of(result);
                  }),
                );
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

  login(loginDto: LoginDto): Observable<Tokens> {
    return from(this.validateUser(loginDto.email, loginDto.password)).pipe(
      switchMap((user) => {
        return this.getTokens(
          user._id,
          user.email,
          loginDto.rememberMe ?? false,
        ).pipe(
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
    rememberMe: boolean,
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
            return this.getTokens(user._id, user.email, rememberMe).pipe(
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

  getTokens(
    userId: Schema.Types.ObjectId,
    email: string,
    rememberMe: boolean,
  ): Observable<Tokens> {
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
            rememberMe: rememberMe,
          },
          {
            secret: configService.getRefreshJwtSecret(),
            expiresIn: rememberMe
              ? configService.getRefreshTokenRememberMeExpiresIn()
              : configService.getRefreshTokenExpiresIn(),
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
