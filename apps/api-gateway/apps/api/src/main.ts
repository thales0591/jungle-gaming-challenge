import { NestFactory } from '@nestjs/core';
import { MainModule } from './infra/ioc/main.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(MainModule);

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`API Gateway running on http://localhost:${port}/api`);
}
void bootstrap();
