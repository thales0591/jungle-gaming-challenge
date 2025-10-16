import { MarkNotificationAsReadUseCase } from '@core/application/usecases/mark-notification-as-read';
import { InMemoryNotificationRepository } from '../utils/repositories/in-memory-notification-repository';
import { makeNotification } from '../utils/factories/make-notification';
import { UniqueId } from '@core/domain/value-objects/unique-id';

let notificationRepository: InMemoryNotificationRepository;
let sut: MarkNotificationAsReadUseCase;

describe('MarkNotificationAsReadUseCase', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    sut = new MarkNotificationAsReadUseCase(notificationRepository);
  });

  it('should be able to mark notification as read', async () => {
    const userId = UniqueId.create();
    const notification = makeNotification({ userId, haveBeenRead: false });
    notificationRepository.items.push(notification);

    await sut.execute({
      notificationId: notification.id,
      userId,
    });

    const updated = await notificationRepository.findById(notification.id);
    expect(updated?.haveBeenRead).toBe(true);
  });

  it('should not be able to mark non-existent notification as read', async () => {
    const userId = UniqueId.create();
    const nonExistentId = UniqueId.create();

    await expect(
      sut.execute({
        notificationId: nonExistentId,
        userId,
      }),
    ).rejects.toThrow('Notification not found');
  });

  it('should not be able to mark notification of another user as read', async () => {
    const userId1 = UniqueId.create();
    const userId2 = UniqueId.create();
    const notification = makeNotification({ userId: userId1 });
    notificationRepository.items.push(notification);

    await expect(
      sut.execute({
        notificationId: notification.id,
        userId: userId2,
      }),
    ).rejects.toThrow('Notification not found');
  });

  it('should be able to handle already read notification', async () => {
    const userId = UniqueId.create();
    const notification = makeNotification({ userId, haveBeenRead: true });
    notificationRepository.items.push(notification);

    await sut.execute({
      notificationId: notification.id,
      userId,
    });

    const updated = await notificationRepository.findById(notification.id);
    expect(updated?.haveBeenRead).toBe(true);
  });
});
