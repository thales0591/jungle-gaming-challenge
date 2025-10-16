import { NotificationRepository } from '@core/domain/ports/notification-repository';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export interface MarkAllNotificationsAsReadProps {
  userId: UniqueId;
}

export class MarkAllNotificationsAsReadUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute({ userId }: MarkAllNotificationsAsReadProps): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }
}
