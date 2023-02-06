import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { from, Observable, of, switchMap } from 'rxjs';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class AdminUserGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User | Observable<User> | undefined;
    const i18nContext = I18nContext.current();

    if (!user) {
      throw new ForbiddenException(i18nContext.t('errors.forbidden'));
    }

    if (user instanceof Observable) {
      return from(user).pipe(
        switchMap((user) => {
          if (!this.checkAdmin(user)) {
            throw new ForbiddenException(i18nContext.t('errors.forbidden'));
          }
          return of(true);
        }),
      );
    }

    if (!this.checkAdmin(user)) {
      throw new ForbiddenException(i18nContext.t('errors.forbidden'));
    }

    return true;
  }

  private checkAdmin(user: User) {
    return !!user.isAdmin;
  }
}
