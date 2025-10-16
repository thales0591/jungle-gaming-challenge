import { RefreshTokenUseCase } from '@core/application/usecases/refresh-token';
import { InMemoryUserRepository } from '../utils/repositories/in-memory-user-repository';
import { FakeAuthToken } from '../utils/fakes/fake-auth-token';
import { makeUser } from '../utils/factories/make-user';
import { UnauthorizedException } from '@nestjs/common';

let userRepository: InMemoryUserRepository;
let tokenManager: FakeAuthToken;
let sut: RefreshTokenUseCase;

describe('RefreshTokenUseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    tokenManager = new FakeAuthToken();
    sut = new RefreshTokenUseCase(userRepository, tokenManager);
  });

  it('should be able to refresh tokens with valid refresh token', async () => {
    const user = makeUser({ email: 'johndoe@example.com' });
    userRepository.items.push(user);

    const oldRefreshToken = await tokenManager.generate({
      payload: { userId: user.id.value },
      secret: 'refresh-secret',
    });
    await userRepository.saveRefreshToken(user.id.value, oldRefreshToken);

    const result = await sut.execute(oldRefreshToken);

    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(result.refreshToken).not.toBe(oldRefreshToken);
  });

  it('should be able to generate new access and refresh tokens', async () => {
    const user = makeUser({ email: 'johndoe@example.com' });
    userRepository.items.push(user);

    const oldRefreshToken = await tokenManager.generate({
      payload: { userId: user.id.value },
      secret: 'refresh-secret',
    });
    await userRepository.saveRefreshToken(user.id.value, oldRefreshToken);

    const result = await sut.execute(oldRefreshToken);

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(typeof result.accessToken).toBe('string');
    expect(typeof result.refreshToken).toBe('string');
  });

  it('should be able to save new refresh token and invalidate old one', async () => {
    const user = makeUser({ email: 'johndoe@example.com' });
    userRepository.items.push(user);

    const oldRefreshToken = await tokenManager.generate({
      payload: { userId: user.id.value },
      secret: 'refresh-secret',
    });
    await userRepository.saveRefreshToken(user.id.value, oldRefreshToken);

    const result = await sut.execute(oldRefreshToken);

    const userWithNewToken = await userRepository.findByRefreshToken(
      result.refreshToken,
    );
    const userWithOldToken =
      await userRepository.findByRefreshToken(oldRefreshToken);

    expect(userWithNewToken).toBeDefined();
    expect(userWithNewToken?.id.value).toBe(user.id.value);
    expect(userWithOldToken).toBeNull();
  });

  it('should not be able to refresh with invalid token', async () => {
    await expect(sut.execute('invalid-token')).rejects.toThrow(
      'Invalid refresh token',
    );
  });

  it('should not be able to refresh with revoked token', async () => {
    const user = makeUser({ email: 'johndoe@example.com' });
    userRepository.items.push(user);

    const refreshToken = await tokenManager.generate({
      payload: { userId: user.id.value },
      secret: 'refresh-secret',
    });

    await expect(sut.execute(refreshToken)).rejects.toThrow(
      'Refresh token revoked',
    );
  });

  it('should not be able to refresh with revoked token from different user', async () => {
    const user = makeUser({ email: 'johndoe@example.com' });
    userRepository.items.push(user);

    const refreshToken = await tokenManager.generate({
      payload: { userId: 'different-user-id' },
      secret: 'refresh-secret',
    });

    await expect(sut.execute(refreshToken)).rejects.toThrow();
  });
});
