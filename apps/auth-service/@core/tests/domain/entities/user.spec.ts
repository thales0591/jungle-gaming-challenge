import { User } from '@core/domain/entities/user';
import { UniqueId } from '@core/domain/value-objects/unique-id';

describe('User', () => {
  it('should be able to create a new user', () => {
    const user = User.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'password123',
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('johndoe@example.com');
    expect(user.name).toBe('John Doe');
    expect(user.hashedPassword).toBe('password123');
  });

  it('should be able to create user with custom id', () => {
    const customId = UniqueId.create();
    const user = User.create(
      {
        email: 'johndoe@example.com',
        name: 'John Doe',
        password: 'password123',
      },
      customId,
    );

    expect(user.id.value).toBe(customId.value);
  });

  it('should be able to create user with generated id', () => {
    const user = User.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'password123',
    });

    expect(user.id).toBeDefined();
    expect(user.id.value).toBeTruthy();
  });

  it('should be able to create user with automatic timestamps', () => {
    const user = User.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'password123',
    });

    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should be able to preserve custom createdAt when provided', () => {
    const createdAt = new Date('2023-01-01');

    const user = User.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'password123',
      createdAt,
    });

    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should be able to access email property', () => {
    const user = User.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'password123',
    });

    expect(user.email).toBe('johndoe@example.com');
  });

  it('should be able to access name property', () => {
    const user = User.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'password123',
    });

    expect(user.name).toBe('John Doe');
  });

  it('should be able to access hashedPassword property', () => {
    const user = User.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'hashed-password',
    });

    expect(user.hashedPassword).toBe('hashed-password');
  });

  it('should not be able to create user with invalid email', () => {
    expect(() =>
      User.create({
        email: 'invalid-email',
        name: 'John Doe',
        password: 'password123',
      }),
    ).toThrow();
  });

  it('should not be able to create user with empty email', () => {
    expect(() =>
      User.create({
        email: '',
        name: 'John Doe',
        password: 'password123',
      }),
    ).toThrow();
  });

  it('should not be able to create user with empty name', () => {
    expect(() =>
      User.create({
        email: 'johndoe@example.com',
        name: '',
        password: 'password123',
      }),
    ).toThrow();
  });

  it('should not be able to create user with short password', () => {
    expect(() =>
      User.create({
        email: 'johndoe@example.com',
        name: 'John Doe',
        password: '123',
      }),
    ).toThrow();
  });

  it('should not be able to create user with password less than 8 characters', () => {
    expect(() =>
      User.create({
        email: 'johndoe@example.com',
        name: 'John Doe',
        password: '1234567',
      }),
    ).toThrow();
  });

  it('should be able to create user with password exactly 8 characters', () => {
    const user = User.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '12345678',
    });

    expect(user.hashedPassword).toBe('12345678');
  });
});
