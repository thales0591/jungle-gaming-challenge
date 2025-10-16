import { GetUnreadCountUseCase } from '@core/application/usecases/get-unread-count';
import { InMemoryNotificationRepository } from '../utils/repositories/in-memory-notification-repository';
import { makeNotification } from '../utils/factories/make-notification';
import { UniqueId } from '@core/domain/value-objects/unique-id';

let notificationRepository: InMemoryNotificationRepository;
let sut: GetUnreadCountUseCase;

describe('GetUnreadCountUseCase', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    sut = new GetUnreadCountUseCase(notificationRepository);
  });

  it('should be able to get unread count', async () => {
    const userId = UniqueId.create();
    const notification1 = makeNotification({ userId, haveBeenRead: false });
    const notification2 = makeNotification({ userId, haveBeenRead: false });
    const notification3 = makeNotification({ userId, haveBeenRead: true });
    notificationRepository.items.push(
      notification1,
      notification2,
      notification3,
    );

    const result = await sut.execute({ userId });

    expect(result).toBe(2);
  });

  it('should be able to return zero when no unread notifications', async () => {
    const userId = UniqueId.create();
    const notification = makeNotification({ userId, haveBeenRead: true });
    notificationRepository.items.push(notification);

    const result = await sut.execute({ userId });

    expect(result).toBe(0);
  });

  it('should be able to count only notifications for specific user', async () => {
    const userId1 = UniqueId.create();
    const userId2 = UniqueId.create();
    const notification1 = makeNotification({ userId: userId1, haveBeenRead: false });
    const notification2 = makeNotification({ userId: userId2, haveBeenRead: false });
    notificationRepository.items.push(notification1, notification2);

    const result = await sut.execute({ userId: userId1 });

    expect(result).toBe(1);
  });

  it('should be able to return zero when user has no notifications', async () => {
    const userId = UniqueId.create();

    const result = await sut.execute({ userId });

    expect(result).toBe(0);
  });
});
