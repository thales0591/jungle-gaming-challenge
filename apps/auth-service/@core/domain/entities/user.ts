import { StringValidator } from '../validators/strings-validator';
import { UniqueId } from '../value-objects/unique-id';
import { AggregateRoot } from './aggregate-root';

export interface UserProps {
  email: string;
  name: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueId) {
    super(props, id);
    this.props.createdAt = props.createdAt ?? new Date();
    this.props.updatedAt = props.updatedAt ?? new Date();
    this.validate();
  }

  static create(props: UserProps, id?: UniqueId): User {
    return new User(props, id);
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get hashedPassword(): string {
    return this.props.password;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  protected validate(): void {
    StringValidator.isEmailOrThrows('email', this.props.email);
    StringValidator.isNotEmptyOrThrows('name', this.props.name);
    StringValidator.isPasswordOrThrows(this.props.password);
  }
}
