import { Notification } from '@core/domain/entities/notification';
import { UniqueId } from '@core/domain/value-objects/unique-id';

describe('Notification', () => {
  it('should be able to create a new notification', () => {
    const userId = UniqueId.create();
    const notification = Notification.create({
      userId,
      content: 'Test notification',
      haveBeenRead: false,
    });

    expect(notification).toBeDefined();
    expect(notification.userId.value).toBe(userId.value);
    expect(notification.content).toBe('Test notification');
    expect(notification.haveBeenRead).toBe(false);
  });

  it('should be able to create notification with custom id', () => {
    const customId = UniqueId.create();
    const userId = UniqueId.create();
    const notification = Notification.create(
      {
        userId,
        content: 'Test notification',
        haveBeenRead: false,
      },
      customId,
    );

    expect(notification.id.value).toBe(customId.value);
  });

  it('should be able to mark notification as read', () => {
    const userId = UniqueId.create();
    const notification = Notification.create({
      userId,
      content: 'Test notification',
      haveBeenRead: false,
    });

    notification.markAsRead();

    expect(notification.haveBeenRead).toBe(true);
  });

  it('should be able to mark notification as unread', () => {
    const userId = UniqueId.create();
    const notification = Notification.create({
      userId,
      content: 'Test notification',
      haveBeenRead: true,
    });

    notification.markAsUnread();

    expect(notification.haveBeenRead).toBe(false);
  });

  it('should be able to update updatedAt when marking as read', () => {
    const userId = UniqueId.create();
    const notification = Notification.create({
      userId,
      content: 'Test notification',
      haveBeenRead: false,
    });

    const initialUpdatedAt = notification.updatedAt;
    notification.markAsRead();

    expect(notification.updatedAt).toBeDefined();
    expect(notification.updatedAt).not.toBe(initialUpdatedAt);
  });

  it('should not be able to create notification with empty content', () => {
    const userId = UniqueId.create();

    expect(() =>
      Notification.create({
        userId,
        content: '',
        haveBeenRead: false,
      }),
    ).toThrow();
  });

  it('should be able to access all properties', () => {
    const userId = UniqueId.create();
    const notification = Notification.create({
      userId,
      content: 'Test notification',
      haveBeenRead: false,
    });

    expect(notification.userId).toBeDefined();
    expect(notification.content).toBe('Test notification');
    expect(notification.haveBeenRead).toBe(false);
    expect(notification.createdAt).toBeInstanceOf(Date);
  });
});
