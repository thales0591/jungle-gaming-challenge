import { UserReadModelRepository } from '@core/domain/ports/user-read-model-repository';
import { UserReadModel } from '@core/domain/entities/user-read-model';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export class InMemoryUserReadModelRepository extends UserReadModelRepository {
  public items: UserReadModel[] = [];

  async findById(id: UniqueId): Promise<UserReadModel | null> {
    return this.items.find((item) => item.id.value === id.value) || null;
  }

  async save(user: UserReadModel): Promise<void> {
    const existingIndex = this.items.findIndex(
      (item) => item.id.value === user.id.value,
    );
    if (existingIndex >= 0) {
      this.items[existingIndex] = user;
    } else {
      this.items.push(user);
    }
  }

  async findManyByIds(ids: UniqueId[]): Promise<UserReadModel[]> {
    const idValues = ids.map((id) => id.value);
    return this.items.filter((item) => idValues.includes(item.id.value));
  }
}
