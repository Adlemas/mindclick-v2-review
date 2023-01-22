import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from 'src/config/config.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from 'src/config/config.service';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { UserLocaleResolver } from 'src/lib/resolvers/user-locale.resolver';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    UsersModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getMongoUri(),
      }),
      inject: [ConfigService],
    }),
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        fallbackLanguage: configService.getLang(),
        loaderOptions: {
          path: path.join(__dirname, `/i18n/`),
          watch: configService.isDev(),
        },
        resolvers: [UserLocaleResolver, AcceptLanguageResolver],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
