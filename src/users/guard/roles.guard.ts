import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { from, Observable, of, switchMap } from 'rxjs';
import { Role } from 'src/enum/role.enum';
import { Reflector } from '@nestjs/core';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User | Observable<User> | undefined;
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    const i18nContext = I18nContext.current();

    if (!user) {
      throw new ForbiddenException(i18nContext.t('errors.forbidden'));
    }

    if (user instanceof Observable) {
      return from(user).pipe(
        switchMap((user) => {
          if (!this.checkRole(user, roles)) {
            throw new ForbiddenException(i18nContext.t('errors.forbidden'));
          }
          return of(true);
        }),
      );
    }

    if (!this.checkRole(user, roles)) {
      throw new ForbiddenException(i18nContext.t('errors.forbidden'));
    }

    return true;
  }

  private checkRole(user: User, roles: Array<Role>) {
    console.log({ role: user.role, roles });
    return roles.includes(user.role);
  }
}
