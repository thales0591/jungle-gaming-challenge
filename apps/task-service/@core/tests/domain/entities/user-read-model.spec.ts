import { UserReadModel } from '@core/domain/entities/user-read-model';
import { UniqueId } from '@core/domain/value-objects/unique-id';

describe('UserReadModel', () => {
  it('should be able to create a new user read model', () => {
    const id = UniqueId.create();
    const user = new UserReadModel(id, 'user@example.com', 'Test User', new Date());

    expect(user).toBeDefined();
    expect(user.id.value).toBe(id.value);
    expect(user.email).toBe('user@example.com');
    expect(user.name).toBe('Test User');
  });

  it('should be able to access all properties', () => {
    const id = UniqueId.create();
    const createdAt = new Date();
    const user = new UserReadModel(id, 'user@example.com', 'Test User', createdAt);

    expect(user.id).toBeDefined();
    expect(user.email).toBe('user@example.com');
    expect(user.name).toBe('Test User');
    expect(user.createdAt).toBe(createdAt);
  });
});
