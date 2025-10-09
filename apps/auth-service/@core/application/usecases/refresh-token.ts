import { UserRepository } from '@core/domain/ports/user-repository';
import { AuthToken } from '../ports/auth-token';
import { Environment } from '../environment';
import { UnauthorizedException } from '@core/domain/exceptions/unauthorized-exception';

export interface RefreshTokenUseCaseResponse {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenManager: AuthToken,
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokenUseCaseResponse> {
    let payload: { userId: string };

    try {
      payload = await this.tokenManager.validate({
        token: refreshToken,
        secret: Environment.auth.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findByRefreshToken(refreshToken);

    if (!user) throw new UnauthorizedException('Refresh token revoked');

    const newAccessToken = await this.tokenManager.generate({
      payload: { userId: user.id },
      secret: Environment.auth.secret,
      expiresAt: this.getSessionExpiration(),
    });

    const newRefreshToken = await this.tokenManager.generate({
      payload: { userId: user.id },
      secret: Environment.auth.refreshSecret,
      expiresAt: this.getRefreshSessionExpiration(),
    });

    await this.userRepository.saveRefreshToken(user.id.value, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
  private getSessionExpiration(): Date {
    const tokenExpirationInSeconds = Environment.auth.authExpirationInSeconds;

    return new Date(Date.now() + tokenExpirationInSeconds * 1000);
  }

  private getRefreshSessionExpiration(): Date {
    const refreshTokenExpirationInSeconds =
      Environment.auth.refreshExpirationInSeconds;

    return new Date(Date.now() + refreshTokenExpirationInSeconds * 1000);
  }
}
