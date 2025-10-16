import { User } from '@core/domain/entities/user';
import { UserRepository } from '@core/domain/ports/user-repository';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = [];
  private refreshTokens = new Map<string, string>(); // userId -> refreshToken

  async save(entity: User): Promise<void> {
    this.items.push(entity);
  }

  async update(entity: User): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.value === entity.id.value,
    );

    if (itemIndex >= 0) {
      this.items[itemIndex] = entity;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);
    return user ?? null;
  }

  async findById(id: UniqueId): Promise<User | null> {
    const user = this.items.find((item) => item.id.value === id.value);
    return user ?? null;
  }

  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    this.refreshTokens.set(userId, refreshToken);
  }

  async findByRefreshToken(token: string): Promise<User | null> {
    for (const [userId, storedToken] of this.refreshTokens.entries()) {
      if (storedToken === token) {
        const user = this.items.find((item) => item.id.value === userId);
        return user ?? null;
      }
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return this.items;
  }
}
