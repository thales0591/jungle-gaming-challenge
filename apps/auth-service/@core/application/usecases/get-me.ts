import { UserRepository } from '@core/domain/ports/user-repository';
import { NotFoundException } from '@core/domain/exceptions/not-found-exception';
import { User } from '@core/domain/entities/user';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export class GetMeUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: UniqueId): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
