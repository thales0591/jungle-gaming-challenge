import { User, UserProps } from '@core/domain/entities/user';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueId,
): User {
  return User.create(
    {
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'password123-hashed',
      ...override,
    },
    id,
  );
}
