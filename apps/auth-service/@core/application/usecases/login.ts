import { UserRepository } from '@core/domain/ports/user-repository';
import { Encrypter } from '../ports/encrypter';
import { NotFoundException } from '@core/domain/exceptions/not-found-exception';
import { AuthToken } from '../ports/auth-token';
import { Environment } from '../environment';
import { UnauthorizedException } from '@core/domain/exceptions/unauthorized-exception';
import { UserPayload } from '../auth/user.payload';

export interface LoginProps {
  email: string;
  password: string;
}

export interface LoginUseCaseResponse {
  accessToken: string;
  refreshToken: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encrypter: Encrypter,
    private readonly tokenManager: AuthToken,
  ) {}

  async execute({
    email,
    password,
  }: LoginProps): Promise<LoginUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('');
    }

    const passwordMatches = await this.encrypter.compare(
      password,
      user.hashedPassword,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('');
    }

    const accessToken = await this.tokenManager.generate<UserPayload>({
      payload: { userId: user.id.value },
      secret: Environment.auth.secret,
      expiresAt: this.getSessionExpiration(),
    });

    const refreshToken = await this.tokenManager.generate<UserPayload>({
      payload: { userId: user.id.value },
      secret: Environment.auth.refreshSecret,
      expiresAt: this.getRefreshSessionExpiration(),
    });

    await this.userRepository.saveRefreshToken(user.id.value, refreshToken);

    return { accessToken, refreshToken };
  }

  private getSessionExpiration(): Date {
    const tokenExpirationInSeconds = Environment.auth.authExpirationInSeconds;

    return new Date(Date.now() + tokenExpirationInSeconds * 1000);
  }

  private getRefreshSessionExpiration(): Date {
    const refreshTokenExpirationInSeconds = Environment.auth.refreshExpirationInSeconds;

    return new Date(Date.now() + refreshTokenExpirationInSeconds * 1000);
  }
}
