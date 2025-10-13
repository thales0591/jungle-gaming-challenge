import { NestFactory } from '@nestjs/core';
import { MainModule } from './infra/ioc/main.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(MainModule);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<string>('PORT');

  await app.listen(port);

  logger.log(`API Gateway running on http://localhost:${port}/api`);
}
void bootstrap();
