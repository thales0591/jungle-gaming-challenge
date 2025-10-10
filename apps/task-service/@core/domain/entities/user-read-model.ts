import { UniqueId } from '../value-objects/unique-id';

export class UserReadModel {
  constructor(
    public readonly id: UniqueId,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date,
  ) {}
}