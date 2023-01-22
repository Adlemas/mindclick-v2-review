import { Inject, Injectable } from '@nestjs/common';
import { I18nContext, I18nService, Path, TranslateOptions } from 'nestjs-i18n';

@Injectable()
export class LocaleService<K = Record<string, unknown>> {
  @Inject(I18nService)
  private readonly i18nService: I18nService;

  translate<P extends Path<K> = any>(key: P, options?: TranslateOptions) {
    const i18nContext = I18nContext.current();
    return this.i18nService.translate(key, {
      lang: i18nContext.lang ?? undefined,
      ...options,
    });
  }
}
