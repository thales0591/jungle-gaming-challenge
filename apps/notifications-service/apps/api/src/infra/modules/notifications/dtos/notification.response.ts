import { Notification } from '@core/domain/entities/notification';

export class NotificationResponse {
  id: string;
  userId: string;
  content: string;
  haveBeenRead: boolean;
  createdAt: Date;
  updatedAt?: Date;

  static from(notification: Notification): NotificationResponse {
    return {
      id: notification.id.toString(),
      userId: notification.userId.toString(),
      content: notification.content,
      haveBeenRead: notification.haveBeenRead,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }
}
