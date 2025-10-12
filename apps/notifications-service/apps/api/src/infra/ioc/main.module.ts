import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env';
import { NotificationsGateway } from '../websocket/notifications.gateway';
import { TaskEventsListener } from '../listeners/task-events.listener';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  providers: [NotificationsGateway, TaskEventsListener],
  controllers: [TaskEventsListener],
})
export class MainModule {}
