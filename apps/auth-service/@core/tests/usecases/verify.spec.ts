import { VerifyTokenUseCase } from '@core/application/usecases/verify';
import { InMemoryUserRepository } from '../utils/repositories/in-memory-user-repository';
import { FakeAuthToken } from '../utils/fakes/fake-auth-token';
import { makeUser } from '../utils/factories/make-user';

let userRepository: InMemoryUserRepository;
let tokenManager: FakeAuthToken;
let sut: VerifyTokenUseCase;

describe('VerifyTokenUseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    tokenManager = new FakeAuthToken();
    sut = new VerifyTokenUseCase(
      tokenManager,
      userRepository,
      'test-secret',
    );
  });

  it('should be able to verify valid token and return user', async () => {
    const user = makeUser({ email: 'johndoe@example.com' });
    userRepository.items.push(user);

    const token = await tokenManager.generate({
      payload: { userId: user.id.value },
      secret: 'test-secret',
    });

    const result = await sut.execute(token);

    expect(result).toBeDefined();
    expect(result.id.value).toBe(user.id.value);
    expect(result.email).toBe('johndoe@example.com');
  });

  it('should be able to return user with all properties from token', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      name: 'John Doe',
    });
    userRepository.items.push(user);

    const token = await tokenManager.generate({
      payload: { userId: user.id.value },
      secret: 'test-secret',
    });

    const result = await sut.execute(token);

    expect(result.email).toBe('johndoe@example.com');
    expect(result.name).toBe('John Doe');
    expect(result.id.value).toBe(user.id.value);
  });

  it('should not be able to verify with empty token', async () => {
    await expect(sut.execute('')).rejects.toThrow('Missing token');
  });

  it('should not be able to verify with invalid token', async () => {
    await expect(sut.execute('invalid-token')).rejects.toThrow(
      'Invalid or expired token',
    );
  });

  it('should not be able to verify when token is valid but user does not exist', async () => {
    const nonExistentUserId = '123e4567-e89b-12d3-a456-426614174000';
    const token = await tokenManager.generate({
      payload: { userId: nonExistentUserId },
      secret: 'test-secret',
    });

    await expect(sut.execute(token)).rejects.toThrow('User no longer exists');
  });

  it('should not be able to verify token for deleted user', async () => {
    const user = makeUser({ email: 'johndoe@example.com' });
    userRepository.items.push(user);

    const token = await tokenManager.generate({
      payload: { userId: user.id.value },
      secret: 'test-secret',
    });

    userRepository.items = [];

    await expect(sut.execute(token)).rejects.toThrow('User no longer exists');
  });

  it('should not be able to verify and throw UnauthorizedException for missing token', async () => {
    await expect(sut.execute('')).rejects.toThrow();
  });

  it('should not be able to verify and throw UnauthorizedException for invalid token', async () => {
    await expect(sut.execute('invalid-token')).rejects.toThrow();
  });
});
