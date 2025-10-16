import { FetchAllUsersUseCase } from '@core/application/usecases/fetch-users';
import { InMemoryUserRepository } from '../utils/repositories/in-memory-user-repository';
import { makeUser } from '../utils/factories/make-user';

let userRepository: InMemoryUserRepository;
let sut: FetchAllUsersUseCase;

describe('FetchAllUsersUseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new FetchAllUsersUseCase(userRepository);
  });

  it('should be able to fetch all users', async () => {
    const user1 = makeUser({ email: 'johndoe@example.com' });
    const user2 = makeUser({ email: 'janedoe@example.com' });
    const user3 = makeUser({ email: 'bob@example.com' });

    userRepository.items.push(user1, user2, user3);

    const result = await sut.execute();

    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: 'johndoe@example.com' }),
        expect.objectContaining({ email: 'janedoe@example.com' }),
        expect.objectContaining({ email: 'bob@example.com' }),
      ]),
    );
  });

  it('should be able to return empty array when no users exist', async () => {
    const result = await sut.execute();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should be able to return users with all properties', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      name: 'John Doe',
    });
    userRepository.items.push(user);

    const result = await sut.execute();

    expect(result[0]).toBeDefined();
    expect(result[0].email).toBe('johndoe@example.com');
    expect(result[0].name).toBe('John Doe');
    expect(result[0].id).toBeDefined();
    expect(result[0].hashedPassword).toBeDefined();
  });

  it('should be able to fetch single user', async () => {
    const user = makeUser({ email: 'johndoe@example.com' });
    userRepository.items.push(user);

    const result = await sut.execute();

    expect(result).toHaveLength(1);
    expect(result[0].id.value).toBe(user.id.value);
  });
});
