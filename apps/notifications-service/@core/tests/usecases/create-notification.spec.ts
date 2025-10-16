import { CreateNotificationUseCase } from '@core/application/usecases/create-notification';
import { InMemoryNotificationRepository } from '../utils/repositories/in-memory-notification-repository';
import { UniqueId } from '@core/domain/value-objects/unique-id';

let notificationRepository: InMemoryNotificationRepository;
let sut: CreateNotificationUseCase;

describe('CreateNotificationUseCase', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    sut = new CreateNotificationUseCase(notificationRepository);
  });

  it('should be able to create a new notification', async () => {
    const userId = UniqueId.create();

    await sut.execute({
      userId,
      content: 'Test notification',
    });

    expect(notificationRepository.items).toHaveLength(1);
    expect(notificationRepository.items[0].content).toBe('Test notification');
    expect(notificationRepository.items[0].haveBeenRead).toBe(false);
  });

  it('should be able to create notification for specific user', async () => {
    const userId = UniqueId.create();

    await sut.execute({
      userId,
      content: 'Test notification',
    });

    expect(notificationRepository.items[0].userId.value).toBe(userId.value);
  });

  it('should not be able to create notification with empty content', async () => {
    const userId = UniqueId.create();

    await expect(
      sut.execute({
        userId,
        content: '',
      }),
    ).rejects.toThrow();
  });
});
