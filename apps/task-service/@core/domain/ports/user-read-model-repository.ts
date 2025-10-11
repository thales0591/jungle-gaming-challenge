import { UserReadModel } from '../entities/user-read-model';
import { UniqueId } from '../value-objects/unique-id';

export abstract class UserReadModelRepository {
  abstract findById(id: UniqueId): Promise<UserReadModel | null>;
  abstract save(user: UserReadModel): Promise<void>;
  abstract findManyByIds(ids: UniqueId[]): Promise<UserReadModel[]>
}
