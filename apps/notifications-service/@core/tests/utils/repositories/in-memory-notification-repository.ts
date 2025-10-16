import { NotificationRepository } from '@core/domain/ports/notification-repository';
import { Notification } from '@core/domain/entities/notification';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export class InMemoryNotificationRepository extends NotificationRepository {
  public items: Notification[] = [];

  async create(notification: Notification): Promise<void> {
    this.items.push(notification);
  }

  async findById(id: UniqueId): Promise<Notification | null> {
    return this.items.find((item) => item.id.value === id.value) || null;
  }

  async findByUserId(
    userId: UniqueId,
    page: number,
    size: number,
  ): Promise<Notification[]> {
    const filtered = this.items.filter(
      (item) => item.userId.value === userId.value,
    );
    const start = (page - 1) * size;
    return filtered.slice(start, start + size);
  }

  async markAsRead(id: UniqueId): Promise<void> {
    const notification = await this.findById(id);
    if (notification) {
      notification.markAsRead();
    }
  }

  async markAllAsRead(userId: UniqueId): Promise<void> {
    const notifications = this.items.filter(
      (item) => item.userId.value === userId.value && !item.haveBeenRead,
    );
    notifications.forEach((notification) => notification.markAsRead());
  }

  async countUnreadByUserId(userId: UniqueId): Promise<number> {
    return this.items.filter(
      (item) => item.userId.value === userId.value && !item.haveBeenRead,
    ).length;
  }

  async delete(id: UniqueId): Promise<void> {
    this.items = this.items.filter((item) => item.id.value !== id.value);
  }
}
