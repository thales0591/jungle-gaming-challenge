import { UniqueId } from '../value-objects/unique-id';

export abstract class Entity {
  public readonly id: UniqueId;

  constructor(id: UniqueId) {
    this.id = id;
  }

  protected abstract validate(): void;
}
