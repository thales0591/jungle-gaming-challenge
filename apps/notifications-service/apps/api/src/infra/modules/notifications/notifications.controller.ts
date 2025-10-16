import {
  GetUserNotificationsUseCase,
  MarkNotificationAsReadUseCase,
  MarkAllNotificationsAsReadUseCase,
  GetUnreadCountUseCase,
} from '@core/application/usecases';
import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { NotificationResponse } from './dtos/notification.response';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { LoggedUserId } from '../../decorators/logged-user.decorator';
import { GetUserNotificationsDto } from './dtos/get-user-notifications.request';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly getUserNotificationsUseCase: GetUserNotificationsUseCase,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private readonly markAllNotificationsAsReadUseCase: MarkAllNotificationsAsReadUseCase,
    private readonly getUnreadCountUseCase: GetUnreadCountUseCase,
  ) {}

  @Get()
  async getUserNotifications(
    @LoggedUserId() userId: string,
    @Query() { page, size }: GetUserNotificationsDto,
  ): Promise<NotificationResponse[]> {
    const notifications = await this.getUserNotificationsUseCase.execute({
      userId: UniqueId.create(userId),
      page: page,
      size: size,
    });

    return notifications.map(NotificationResponse.from);
  }

  @Get('unread-count')
  async getUnreadCount(
    @LoggedUserId() userId: string,
  ): Promise<{ count: number }> {
    const count = await this.getUnreadCountUseCase.execute({
      userId: UniqueId.create(userId),
    });

    return { count };
  }

  @Patch(':id/read')
  async markAsRead(
    @LoggedUserId() userId: string,
    @Param('id') notificationId: string,
  ): Promise<void> {
    await this.markNotificationAsReadUseCase.execute({
      notificationId: UniqueId.create(notificationId),
      userId: UniqueId.create(userId),
    });
  }

  @Patch('read-all')
  async markAllAsRead(@LoggedUserId() userId: string): Promise<void> {
    await this.markAllNotificationsAsReadUseCase.execute({
      userId: UniqueId.create(userId),
    });
  }
}
