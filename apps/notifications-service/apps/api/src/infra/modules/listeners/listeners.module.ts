import { Module } from '@nestjs/common';
import { TaskEventsListener } from './task-events.listener';
import { UseCasesModule } from '../../ioc/usecases/usecases.module';
import { NotificationsGateway } from '../../websocket/notifications.gateway';
import { AdaptersModule } from '../../ioc/adapters/adapters.module';

@Module({
  imports: [UseCasesModule, AdaptersModule],
  providers: [TaskEventsListener, NotificationsGateway],
  controllers: [TaskEventsListener],
  exports: [TaskEventsListener],
})
export class ListenersModule {}
