import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { envSchema } from './env/env';
import { MiddlewareModule } from '../middlewares/middlewate.module';
import { AuthModule } from '../modules/auth/auth.module';
import { RmqModule } from '../messaging/rmq.module';
import { UsersModule } from '../modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    DatabaseModule,
    MiddlewareModule,
    AuthModule,
    RmqModule,
    UsersModule,
  ],
})
export class MainModule {}
