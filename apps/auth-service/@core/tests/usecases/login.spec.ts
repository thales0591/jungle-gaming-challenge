import { LoginUseCase } from '@core/application/usecases/login';
import { InMemoryUserRepository } from '../utils/repositories/in-memory-user-repository';
import { FakeEncrypter } from '../utils/fakes/fake-encrypter';
import { FakeAuthToken } from '../utils/fakes/fake-auth-token';
import { makeUser } from '../utils/factories/make-user';

let userRepository: InMemoryUserRepository;
let encrypter: FakeEncrypter;
let tokenManager: FakeAuthToken;
let sut: LoginUseCase;

describe('LoginUseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    encrypter = new FakeEncrypter();
    tokenManager = new FakeAuthToken();
    sut = new LoginUseCase(userRepository, encrypter, tokenManager);
  });

  it('should be able to login with valid credentials', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: 'password123-hashed',
    });
    userRepository.items.push(user);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: 'password123',
    });

    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
  });

  it('should be able to return both accessToken and refreshToken', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: 'password123-hashed',
    });
    userRepository.items.push(user);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: 'password123',
    });

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(typeof result.accessToken).toBe('string');
    expect(typeof result.refreshToken).toBe('string');
  });

  it('should be able to save refresh token after successful login', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: 'password123-hashed',
    });
    userRepository.items.push(user);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: 'password123',
    });

    const foundUser = await userRepository.findByRefreshToken(
      result.refreshToken,
    );

    expect(foundUser).toBeDefined();
    expect(foundUser?.id.value).toBe(user.id.value);
  });

  it('should not be able to login if user does not exist', async () => {
    await expect(
      sut.execute({
        email: 'nonexistent@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow();
  });

  it('should not be able to login with wrong password', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: 'password123-hashed',
    });
    userRepository.items.push(user);

    await expect(
      sut.execute({
        email: 'johndoe@example.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow();
  });

  it('should not be able to login with invalid credentials and throw UnauthorizedException', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: 'password123-hashed',
    });
    userRepository.items.push(user);

    await expect(
      sut.execute({
        email: 'johndoe@example.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow();
  });
});
