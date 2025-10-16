import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env';
import { NotificationsGateway } from '../websocket/notifications.gateway';
import { TaskEventsListener } from '../modules/listeners/task-events.listener';
import { NotificationsModule } from '../modules/notifications/notifications.module';
import { DatabaseModule } from './database/database.module';
import { UseCasesModule } from './usecases/usecases.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    DatabaseModule,
    UseCasesModule,
    NotificationsModule,
  ],
  providers: [NotificationsGateway, TaskEventsListener],
  controllers: [TaskEventsListener],
})
export class MainModule {}
