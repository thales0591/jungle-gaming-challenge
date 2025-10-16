import { GetMeUseCase } from '@core/application/usecases/get-me';
import { InMemoryUserRepository } from '../utils/repositories/in-memory-user-repository';
import { makeUser } from '../utils/factories/make-user';
import { UniqueId } from '@core/domain/value-objects/unique-id';

let userRepository: InMemoryUserRepository;
let sut: GetMeUseCase;

describe('GetMeUseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new GetMeUseCase(userRepository);
  });

  it('should be able to get user by id', async () => {
    const user = makeUser({ email: 'johndoe@example.com' });
    userRepository.items.push(user);

    const result = await sut.execute(user.id);

    expect(result).toBeDefined();
    expect(result.id.value).toBe(user.id.value);
    expect(result.email).toBe('johndoe@example.com');
  });

  it('should be able to return user with all properties', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      name: 'John Doe',
    });
    userRepository.items.push(user);

    const result = await sut.execute(user.id);

    expect(result.email).toBe('johndoe@example.com');
    expect(result.name).toBe('John Doe');
    expect(result.hashedPassword).toBeDefined();
    expect(result.createdAt).toBeDefined();
  });

  it('should not be able to get user with non-existent id', async () => {
    const nonExistentId = UniqueId.create();

    await expect(sut.execute(nonExistentId)).rejects.toThrow('User not found');
  });

  it('should not be able to get user and throw NotFoundException', async () => {
    const nonExistentId = UniqueId.create();

    await expect(sut.execute(nonExistentId)).rejects.toThrow();
  });
});
