import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RmqService } from './rmq.service';
import { EventPublisherAdapter } from './event-publisher-adapter';
import { EventPublisher } from '@core/application/ports/event-publisher';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_CLIENT',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: configService.get<string>('RABBITMQ_NOTIFICATIONS_QUEUE'),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    RmqService,
    {
      provide: EventPublisher,
      useClass: EventPublisherAdapter,
    },
  ],
  exports: [EventPublisher],
})
export class MessagingModule {}
