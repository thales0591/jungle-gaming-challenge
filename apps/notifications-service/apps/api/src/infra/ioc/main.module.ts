import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env';
import { NotificationsGateway } from '../websocket/notifications.gateway';
import { NotificationsModule } from '../modules/notifications/notifications.module';
import { DatabaseModule } from './database/database.module';
import { UseCasesModule } from './usecases/usecases.module';
import { ListenersModule } from '../modules/listeners/listeners.module';
import { AdaptersModule } from './adapters/adapters.module';
import { HealthModule } from '../modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    DatabaseModule,
    UseCasesModule,
    AdaptersModule,
    NotificationsModule,
    ListenersModule,
    HealthModule,
  ],
  providers: [NotificationsGateway],
})
export class MainModule {}
