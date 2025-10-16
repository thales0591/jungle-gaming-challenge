import { UserReadModel } from '@core/domain/entities/user-read-model';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export function makeUserReadModel(
  override?: {
    id?: UniqueId;
    email?: string;
    name?: string;
    createdAt?: Date;
  },
): UserReadModel {
  return new UserReadModel(
    override?.id || UniqueId.create(),
    override?.email || 'user@example.com',
    override?.name || 'Test User',
    override?.createdAt || new Date(),
  );
}
