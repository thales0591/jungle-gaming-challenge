import {
  GetUserNotificationsUseCase,
  MarkNotificationAsReadUseCase,
  MarkAllNotificationsAsReadUseCase,
  GetUnreadCountUseCase,
  CreateNotificationUseCase,
} from '@core/application/usecases';
import { NotificationRepository } from '@core/domain/ports';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: GetUserNotificationsUseCase,
      useFactory: (notificationRepository: NotificationRepository) => {
        return new GetUserNotificationsUseCase(notificationRepository);
      },
      inject: [NotificationRepository],
    },
    {
      provide: MarkNotificationAsReadUseCase,
      useFactory: (notificationRepository: NotificationRepository) => {
        return new MarkNotificationAsReadUseCase(notificationRepository);
      },
      inject: [NotificationRepository],
    },
    {
      provide: MarkAllNotificationsAsReadUseCase,
      useFactory: (notificationRepository: NotificationRepository) => {
        return new MarkAllNotificationsAsReadUseCase(notificationRepository);
      },
      inject: [NotificationRepository],
    },
    {
      provide: GetUnreadCountUseCase,
      useFactory: (notificationRepository: NotificationRepository) => {
        return new GetUnreadCountUseCase(notificationRepository);
      },
      inject: [NotificationRepository],
    },
    {
      provide: CreateNotificationUseCase,
      useFactory: (notificationRepository: NotificationRepository) => {
        return new CreateNotificationUseCase(notificationRepository);
      },
      inject: [NotificationRepository],
    },
  ],
  exports: [
    GetUserNotificationsUseCase,
    MarkNotificationAsReadUseCase,
    MarkAllNotificationsAsReadUseCase,
    GetUnreadCountUseCase,
    CreateNotificationUseCase,
  ],
})
export class UseCasesModule {}
