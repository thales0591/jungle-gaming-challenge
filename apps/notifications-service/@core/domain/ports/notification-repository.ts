import { Notification } from '../entities/notification';
import { UniqueId } from '../value-objects/unique-id';

export abstract class NotificationRepository {
  abstract create(notification: Notification): Promise<void>;
  abstract findById(id: UniqueId): Promise<Notification | null>;
  abstract findByUserId(
    userId: UniqueId,
    page: number,
    size: number,
  ): Promise<Notification[]>;
  abstract markAsRead(id: UniqueId): Promise<void>;
  abstract markAllAsRead(userId: UniqueId): Promise<void>;
  abstract countUnreadByUserId(userId: UniqueId): Promise<number>;
  abstract delete(id: UniqueId): Promise<void>;
}
