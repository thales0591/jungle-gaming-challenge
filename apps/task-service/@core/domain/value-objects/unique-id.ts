import { v4 as uuid } from 'uuid';
import { StringValidator } from '../validators/strings-validator';
import { ValueObject } from './value-object';

export class UniqueId extends ValueObject<string> {
  constructor(value?: string) {
    super(value ?? uuid());
    this.validate();
  }

  protected validate(): void {
    StringValidator.isUUIDOrThrows('id', this.value);
  }

  static create(value?: string): UniqueId {
    return new UniqueId(value);
  }

  public toString(): string {
    return this.value;
  }
}
