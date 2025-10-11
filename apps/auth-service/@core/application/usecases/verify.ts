import { UnauthorizedException } from '@nestjs/common';
import { AuthToken } from '../ports/auth-token';
import { UserRepository } from '@core/domain/ports/user-repository';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { UserPayload } from '../auth/user.payload';

export class VerifyTokenUseCase {
  constructor(
    private readonly authToken: AuthToken,
    private readonly userRepository: UserRepository,
    private readonly authSecret: string,
  ) {}

  async execute(token: string) {
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    let payload: UserPayload;
    try {
      payload = await this.authToken.validate<UserPayload>({
        token,
        secret: this.authSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.userRepository.findById(
      new UniqueId(payload.userId),
    );
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return user;
  }
}
