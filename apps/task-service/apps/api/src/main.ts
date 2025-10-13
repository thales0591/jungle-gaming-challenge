import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MainModule } from './infra/ioc/main.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  const configService = app.get(ConfigService);

  const rabbitUrl = configService.getOrThrow<string>('RABBITMQ_URL');
  const rabbitQueue = configService.get<string>('RABBITMQ_QUEUE');

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitUrl],
      queue: rabbitQueue,
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const port = configService.getOrThrow<string>('PORT');

  await app.listen(port);
}
void bootstrap();
