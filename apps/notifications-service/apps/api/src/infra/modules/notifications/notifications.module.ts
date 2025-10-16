import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { UseCasesModule } from '../../ioc/usecases/usecases.module';

@Module({
  imports: [UseCasesModule],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
