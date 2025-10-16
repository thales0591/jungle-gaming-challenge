import { NotificationRepository } from '@core/domain/ports/notification-repository';
import { Notification } from '@core/domain/entities/notification';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export interface CreateNotificationProps {
  userId: UniqueId;
  content: string;
}

export class CreateNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute({ userId, content }: CreateNotificationProps): Promise<void> {
    const notification = Notification.create({
      userId,
      content,
      haveBeenRead: false,
    });

    await this.notificationRepository.create(notification);
  }
}
