import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env';
import { NotificationsGateway } from '../websocket/notifications.gateway';
import { NotificationsModule } from '../modules/notifications/notifications.module';
import { DatabaseModule } from './database/database.module';
import { UseCasesModule } from './usecases/usecases.module';
import { ListenersModule } from '../modules/listeners/listeners.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    DatabaseModule,
    UseCasesModule,
    NotificationsModule,
    ListenersModule,
  ],
  providers: [NotificationsGateway],
})
export class MainModule {}
