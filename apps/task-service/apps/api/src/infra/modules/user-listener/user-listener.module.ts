import { Module } from '@nestjs/common';
import { UserListener } from './user-listener.controller';
import { DatabaseModule } from '../../ioc/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserListener],
})
export class UserListenerModule {}
