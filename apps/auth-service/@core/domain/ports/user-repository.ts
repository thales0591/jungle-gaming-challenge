import { User } from '../entities/user';
import { UniqueId } from '../value-objects/unique-id';

export abstract class UserRepository {
  abstract save(entity: User): Promise<void>;
  abstract update(entity: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: UniqueId): Promise<User | null>;
  abstract saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void>;
  abstract findByRefreshToken(token: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>
}
