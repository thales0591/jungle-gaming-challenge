import { UserRepository } from '@core/domain/ports/user-repository';
import { User } from '@core/domain/entities/user';


export class FetchAllUsersUseCase {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<User[]> {
    const users = await this.userRepository.findAll()
    return users
  }
}
