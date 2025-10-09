import { User } from '@core/domain/entities/user';

export class UserResponse {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static from(domain: User): UserResponse {
    return new UserResponse(
      domain.id.value,
      domain.name,
      domain.email,
      domain.createdAt,
      domain.updatedAt ?? domain.createdAt,
    );
  }
}
