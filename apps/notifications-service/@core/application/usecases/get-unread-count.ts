import { NotificationRepository } from '@core/domain/ports/notification-repository';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export interface GetUnreadCountProps {
  userId: UniqueId;
}

export class GetUnreadCountUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute({ userId }: GetUnreadCountProps): Promise<number> {
    return await this.notificationRepository.countUnreadByUserId(userId);
  }
}
