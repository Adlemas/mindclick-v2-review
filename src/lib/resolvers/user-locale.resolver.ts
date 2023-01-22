import { I18nResolver } from 'nestjs-i18n';
import { ExecutionContext } from '@nestjs/common';

export class UserLocaleResolver implements I18nResolver {
  resolve(context: ExecutionContext) {
    let lang: string;
    const req = context.switchToHttp().getRequest();
    console.log({ user: req.user });
    if (req.user) {
      lang = req.i18nOptions.fallbackLanguage;
    }
    return lang;
  }
}
