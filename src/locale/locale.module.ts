import { Global, Module } from '@nestjs/common';
import { LocaleService } from './locale.service';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { ConfigService } from 'src/config/config.service';
import * as path from 'path';

@Global()
@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        fallbackLanguage: configService.getLang(),
        loaderOptions: {
          path: path.join(__dirname, '..', `/i18n/`),
          watch: configService.isDev(),
        },
      }),
      resolvers: [AcceptLanguageResolver],
      inject: [ConfigService],
    }),
  ],
  providers: [LocaleService],
  exports: [LocaleService],
})
export class LocaleModule {}
