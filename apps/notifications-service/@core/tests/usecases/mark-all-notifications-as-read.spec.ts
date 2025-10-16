import { MarkAllNotificationsAsReadUseCase } from '@core/application/usecases/mark-all-notifications-as-read';
import { InMemoryNotificationRepository } from '../utils/repositories/in-memory-notification-repository';
import { makeNotification } from '../utils/factories/make-notification';
import { UniqueId } from '@core/domain/value-objects/unique-id';

let notificationRepository: InMemoryNotificationRepository;
let sut: MarkAllNotificationsAsReadUseCase;

describe('MarkAllNotificationsAsReadUseCase', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    sut = new MarkAllNotificationsAsReadUseCase(notificationRepository);
  });

  it('should be able to mark all notifications as read', async () => {
    const userId = UniqueId.create();
    const notification1 = makeNotification({ userId, haveBeenRead: false });
    const notification2 = makeNotification({ userId, haveBeenRead: false });
    const notification3 = makeNotification({ userId, haveBeenRead: false });
    notificationRepository.items.push(
      notification1,
      notification2,
      notification3,
    );

    await sut.execute({ userId });

    const unreadCount = await notificationRepository.countUnreadByUserId(userId);
    expect(unreadCount).toBe(0);
  });

  it('should be able to mark only user notifications as read', async () => {
    const userId1 = UniqueId.create();
    const userId2 = UniqueId.create();
    const notification1 = makeNotification({ userId: userId1, haveBeenRead: false });
    const notification2 = makeNotification({ userId: userId2, haveBeenRead: false });
    notificationRepository.items.push(notification1, notification2);

    await sut.execute({ userId: userId1 });

    const unreadCount1 = await notificationRepository.countUnreadByUserId(userId1);
    const unreadCount2 = await notificationRepository.countUnreadByUserId(userId2);
    expect(unreadCount1).toBe(0);
    expect(unreadCount2).toBe(1);
  });

  it('should be able to handle user with no unread notifications', async () => {
    const userId = UniqueId.create();
    const notification = makeNotification({ userId, haveBeenRead: true });
    notificationRepository.items.push(notification);

    await sut.execute({ userId });

    const unreadCount = await notificationRepository.countUnreadByUserId(userId);
    expect(unreadCount).toBe(0);
  });

  it('should be able to handle user with no notifications', async () => {
    const userId = UniqueId.create();

    await sut.execute({ userId });

    const unreadCount = await notificationRepository.countUnreadByUserId(userId);
    expect(unreadCount).toBe(0);
  });
});
