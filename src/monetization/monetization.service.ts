import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Observable, of, switchMap } from 'rxjs';
import { User } from 'src/schemas/user.schema';
import { Monetization } from 'src/interface/monetization.interface';
import { UserRepository } from 'src/users/repository/user.repository';
import { Schema } from 'mongoose';
import { LocaleService } from 'src/locale/locale.service';
import { Role } from 'src/enum/role.enum';
import { Reward } from 'src/monetization/interface/reward.interface';

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

  /**
   * Not method for controller
   * Reward user with specific amount of points & rate
   * Should be called only for users with STUDENT role
   */
  reward(userId: Schema.Types.ObjectId, reward: Reward): Observable<User> {
    return this.userRepository.findById(userId).pipe(
      switchMap((user) => {
        if (!user) {
          throw new ForbiddenException(
            this.localeService.translate('errors.user_not_found'),
          );
        }
        if (user.role !== Role.STUDENT) {
          throw new ForbiddenException(
            this.localeService.translate('errors.user_not_student'),
          );
        }
        return this.userRepository.getUserTeacher(user._id).pipe(
          switchMap((teacher) => {
            const { monetization } = teacher;
            if (monetization.ignoreSimulators.includes(reward.simulator)) {
              return of(user);
            }
            const points = reward.points * monetization.factor;
            const rate = reward.rate * monetization.factor;
            return this.userRepository.updateById(user._id, {
              points: user.points + points,
              rate: user.rate + rate,
            });
          }),
        );
      }),
    );
  }
}
