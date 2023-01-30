import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from 'src/config/config.service';
import { ValidationPipe } from '@nestjs/common';
import {
  I18nValidationPipe,
  I18nValidationExceptionFilter,
  I18nMiddleware,
} from 'nestjs-i18n';
import { UnauthorizedExceptionFilter } from 'src/filters/unauthorized-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()

  app.use(I18nMiddleware);

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
    new UnauthorizedExceptionFilter(),
  );

  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      stopAtFirstError: true,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
    }),
  );

  const configService = app.get(ConfigService);
  await app.listen(configService.getPort());
}
bootstrap();
