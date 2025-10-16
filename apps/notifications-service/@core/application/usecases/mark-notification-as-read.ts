import { NotificationRepository } from '@core/domain/ports/notification-repository';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { NotFoundException } from '@nestjs/common';

export interface MarkNotificationAsReadProps {
  notificationId: UniqueId;
  userId: UniqueId;
}

export class MarkNotificationAsReadUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute({
    notificationId,
    userId,
  }: MarkNotificationAsReadProps): Promise<void> {
    const notification =
      await this.notificationRepository.findById(notificationId);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId.toString() !== userId.toString()) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.haveBeenRead) {
      return;
    }

    await this.notificationRepository.markAsRead(notificationId);
  }
}
