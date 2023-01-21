import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { from, Observable, of, switchMap } from 'rxjs';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  @Inject(UsersService)
  private readonly usersService: UsersService;

  validateUser(
    email: string,
    pass: string,
  ): Observable<Omit<User, 'password'>> {
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
        return null;
      }),
    );
  }
}
