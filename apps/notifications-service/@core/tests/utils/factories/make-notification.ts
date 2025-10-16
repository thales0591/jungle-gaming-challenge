import { Notification, NotificationProps } from '@core/domain/entities/notification';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueId,
): Notification {
  return Notification.create(
    {
      userId: UniqueId.create(),
      content: 'Test notification content',
      haveBeenRead: false,
      createdAt: new Date(),
      ...override,
    },
    id,
  );
}
