import { UniqueId } from '../value-objects/unique-id';
import { Entity } from './entity';

export abstract class AggregateRoot extends Entity {
  protected _createdAt: Date = new Date();
  protected _updatedAt?: Date;

  constructor(id: UniqueId) {
    super(id);
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
