import { GetUserNotificationsUseCase } from '@core/application/usecases/get-user-notifications';
import { InMemoryNotificationRepository } from '../utils/repositories/in-memory-notification-repository';
import { makeNotification } from '../utils/factories/make-notification';
import { UniqueId } from '@core/domain/value-objects/unique-id';

let notificationRepository: InMemoryNotificationRepository;
let sut: GetUserNotificationsUseCase;

describe('GetUserNotificationsUseCase', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    sut = new GetUserNotificationsUseCase(notificationRepository);
  });

  it('should be able to get user notifications', async () => {
    const userId = UniqueId.create();
    const notification1 = makeNotification({ userId });
    const notification2 = makeNotification({ userId });
    notificationRepository.items.push(notification1, notification2);

    const result = await sut.execute({
      userId,
      page: 1,
      size: 10,
    });

    expect(result).toHaveLength(2);
  });

  it('should be able to get paginated notifications', async () => {
    const userId = UniqueId.create();
    const notification1 = makeNotification({ userId });
    const notification2 = makeNotification({ userId });
    const notification3 = makeNotification({ userId });
    notificationRepository.items.push(
      notification1,
      notification2,
      notification3,
    );

    const result = await sut.execute({
      userId,
      page: 1,
      size: 2,
    });

    expect(result).toHaveLength(2);
  });

  it('should be able to get only notifications for specific user', async () => {
    const userId1 = UniqueId.create();
    const userId2 = UniqueId.create();
    const notification1 = makeNotification({ userId: userId1 });
    const notification2 = makeNotification({ userId: userId2 });
    notificationRepository.items.push(notification1, notification2);

    const result = await sut.execute({
      userId: userId1,
      page: 1,
      size: 10,
    });

    expect(result).toHaveLength(1);
    expect(result[0].userId.value).toBe(userId1.value);
  });

  it('should be able to return empty array when no notifications', async () => {
    const userId = UniqueId.create();

    const result = await sut.execute({
      userId,
      page: 1,
      size: 10,
    });

    expect(result).toEqual([]);
  });
});
