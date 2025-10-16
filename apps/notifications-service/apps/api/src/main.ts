import { NestFactory } from '@nestjs/core';
import { MainModule } from './infra/ioc/main.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(MainModule);

  const configService = app.get(ConfigService);

  const rabbitUrl = configService.getOrThrow<string>('RABBITMQ_URL');
  const rabbitQueue = 'notifications_queue';

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

  logger.log(`Notifications Service running on http://localhost:${port}`);
  logger.log(`WebSocket server running on ws://localhost:${port}`);
  logger.log(`Listening to RabbitMQ queue: ${rabbitQueue}`);
}
void bootstrap();
