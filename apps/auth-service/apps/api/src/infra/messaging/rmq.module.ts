import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqService } from './rmq.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_CLIENT',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const url = config.getOrThrow<string>('RABBITMQ_URL');
          const queue = config.getOrThrow<string>('RABBITMQ_QUEUE');
          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue,
              queueOptions: { durable: true },
            },
          };
        },
      },
    ]),
  ],
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {}
