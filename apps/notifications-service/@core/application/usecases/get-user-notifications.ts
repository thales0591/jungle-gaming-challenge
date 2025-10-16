import { NotificationRepository } from '@core/domain/ports/notification-repository';
import { Notification } from '@core/domain/entities/notification';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export interface GetUserNotificationsProps {
  userId: UniqueId;
  page: number;
  size: number;
}

export class GetUserNotificationsUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute({
    userId,
    page,
    size,
  }: GetUserNotificationsProps): Promise<Notification[]> {
    return await this.notificationRepository.findByUserId(userId, page, size);
  }
}
