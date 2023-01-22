import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { from, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class AppService {
  getProfile(user: User | Observable<User>): Observable<User> {
    if (user instanceof Observable) {
      return from(user).pipe(
        switchMap((user) => {
          if (user) {
            return of(user);
          }
          throw new Error('User not found');
        }),
      );
    }
    return of(user);
  }
}
