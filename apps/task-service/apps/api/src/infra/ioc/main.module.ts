import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { envSchema } from './env/env';
import { MiddlewareModule } from '../middlewares/middlewate.module';
import { TaskModule } from '../modules/task/task.module';
import { UserListenerModule } from '../modules/user-listener/user-listener.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    DatabaseModule,
    MiddlewareModule,
    TaskModule,
    UserListenerModule,
  ],
})
export class MainModule {}
