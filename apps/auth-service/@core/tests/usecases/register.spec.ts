import { RegisterUseCase } from '@core/application/usecases/register';
import { InMemoryUserRepository } from '../utils/repositories/in-memory-user-repository';
import { FakeEncrypter } from '../utils/fakes/fake-encrypter';
import { FakeEventPublisher } from '../utils/fakes/fake-event-publisher';
import { makeUser } from '../utils/factories/make-user';

let userRepository: InMemoryUserRepository;
let encrypter: FakeEncrypter;
let eventPublisher: FakeEventPublisher;
let sut: RegisterUseCase;

describe('RegisterUseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    encrypter = new FakeEncrypter();
    eventPublisher = new FakeEventPublisher();
    sut = new RegisterUseCase(userRepository, encrypter, eventPublisher);
  });

  it('should be able to register a new user', async () => {
    const user = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'password123',
    });

    expect(user.email).toBe('johndoe@example.com');
    expect(user.name).toBe('John Doe');
    expect(userRepository.items).toHaveLength(1);
    expect(userRepository.items[0].id.value).toBe(user.id.value);
  });

  it('should be able to hash user password upon registration', async () => {
    const user = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'password123',
    });

    const isPasswordHashed = await encrypter.compare(
      'password123',
      user.hashedPassword,
    );

    expect(isPasswordHashed).toBe(true);
  });

  it('should be able to emit user.created event after registration', async () => {
    const user = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'password123',
    });

    const event = eventPublisher.findEvent('user.created');

    expect(event).toBeDefined();
    expect(event?.payload).toEqual({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  });

  it('should not be able to register with same email twice', async () => {
    const existingUser = makeUser({ email: 'johndoe@example.com' });
    userRepository.items.push(existingUser);

    await expect(
      sut.execute({
        email: 'johndoe@example.com',
        name: 'John Doe',
        password: 'password123',
      }),
    ).rejects.toThrow('User with same e-mail already exists');
  });

  it('should not be able to register with weak password', async () => {
    await expect(
      sut.execute({
        email: 'johndoe@example.com',
        name: 'John Doe',
        password: '123', // senha muito curta
      }),
    ).rejects.toThrow();
  });
});
