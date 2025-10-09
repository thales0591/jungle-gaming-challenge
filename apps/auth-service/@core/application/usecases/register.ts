import { UserRepository } from '@core/domain/ports/user-repository';
import { Encrypter } from '../ports/encrypter';
import { ConflictException } from '@nestjs/common';
import { User } from '@core/domain/entities/user';
import { StringValidator } from '@core/domain/validators/strings-validator';

export interface RegisterProps {
  email: string;
  name: string;
  password: string;
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({ email, name, password }: RegisterProps): Promise<User> {
    const doesUserWithSameEmailAlreadyExists =
      await this.userRepository.findByEmail(email);

    if (doesUserWithSameEmailAlreadyExists) {
      throw new ConflictException('User with same e-mail already exists');
    }

    StringValidator.isPasswordOrThrows(password);

    const hashedPassword = await this.encrypter.hash(password);

    const user = User.create({
      email,
      name,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return user;
  }
}
