import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MainModule } from './infra/ioc/main.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<string>('PORT');

  await app.listen(port);
}
void bootstrap();
