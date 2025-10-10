import { z } from 'zod';
import { DomainException } from '../exceptions/domain-exception';

export class StringValidator {
  static isUUIDOrThrows(field: string, value: string): void {
    const schema = z.uuid();
    const result = schema.safeParse(value);

    if (!result.success) {
      throw new DomainException(`${field} is not a valid UUID`);
    }
  }

  static isEmailOrThrows(field: string, value: string): void {
    const schema = z.email();
    const result = schema.safeParse(value);

    if (!result.success) {
      throw new DomainException(`${field} is not a valid e-mail`);
    }
  }

  static isPasswordOrThrows(value: string): void {
    const schema = z.string().min(8);
    const result = schema.safeParse(value);

    if (!result.success) {
      throw new DomainException('The password provided is not valid or weak');
    }
  }

  static isNotEmptyOrThrows(field: string, value: string): void {
    const schema = z.string().min(1, { message: `${field} cannot be empty` });
    const result = schema.safeParse(value);

    if (!result.success) {
      throw new DomainException(`${field} cannot be empty`);
    }
  }
}
