import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from 'src/config/config.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from 'src/config/config.service';
import { LocaleModule } from './locale/locale.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [
    LocaleModule,
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
    GroupsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
