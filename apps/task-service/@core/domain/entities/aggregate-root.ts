import { Entity } from "./entity";

export abstract class AggregateRoot<Props> extends Entity<Props> {
  protected _createdAt: Date = new Date();
  protected _updatedAt?: Date;

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
