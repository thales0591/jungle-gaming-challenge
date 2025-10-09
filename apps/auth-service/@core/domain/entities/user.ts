import { StringValidator } from '../validators/strings-validator';
import { UniqueId } from '../value-objects/unique-id';
import { AggregateRoot } from './aggregate-root';

export interface UserProps {
  id?: UniqueId;
  email: string;
  name: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends AggregateRoot {
  private _email: string;
  private _name: string;
  private _password: string;

  private constructor(
    id: UniqueId,
    email: string,
    name: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id);

    this._email = email;
    this._name = name;
    this._password = password;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validate();
  }

  static create({
    id,
    email,
    name,
    password,
    createdAt,
    updatedAt,
  }: UserProps): User {
    return new User(
      id || UniqueId.create(),
      email,
      name,
      password,
      createdAt || new Date(),
      updatedAt || new Date(),
    );
  }

  protected validate(): void {
    StringValidator.isEmailOrThrows('email', this._email);
    StringValidator.isPasswordOrThrows(this._password);
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get hashedPassword(): string {
    return this._password;
  }

  private set email(newEmail: string) {
    this._email = newEmail;
    this.validate();
    this.touch();
  }

  private set name(newName: string) {
    StringValidator.isNotEmptyOrThrows('name', newName);
    this._name = newName;
    this.touch();
  }

  private touch() {
    this._updatedAt = new Date();
  }
}
