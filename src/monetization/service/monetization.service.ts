import { Inject, Injectable } from '@nestjs/common';
import { Observable, of, switchMap } from 'rxjs';
import { User } from 'src/schemas/user.schema';
import { Monetization } from 'src/interface/monetization.interface';
import { UserRepository } from 'src/users/repository/user.repository';
import { LocaleService } from 'src/locale/locale.service';

@Injectable()
export class MonetizationService {
  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  @Inject(LocaleService)
  private readonly localeService: LocaleService;

  getMonetization(user: Observable<User>): Observable<Monetization> {
    return user.pipe(
      switchMap((user) => {
        if (!user.monetization) {
          return this.userRepository
            .updateById(user._id, {
              monetization: {
                ignoreSimulators: [],
                factor: 1,
              },
            })
            .pipe(switchMap((updatedUser) => of(updatedUser.monetization)));
        }
        return of(user.monetization);
      }),
    );
  }

  createUpdateMonetization(
    user: Observable<User>,
    dto: Monetization,
  ): Observable<Monetization> {
    return user.pipe(
      switchMap((user) => {
        return this.userRepository
          .updateById(user._id, {
            monetization: dto,
          })
          .pipe(switchMap((updatedUser) => of(updatedUser.monetization)));
      }),
    );
  }

  resetMonetization(user: Observable<User>): Observable<Monetization> {
    return user.pipe(
      switchMap((user) => {
        return this.userRepository
          .updateById(user._id, {
            monetization: {
              ignoreSimulators: [],
              factor: 1,
            },
          })
          .pipe(switchMap((updatedUser) => of(updatedUser.monetization)));
      }),
    );
  }
}
