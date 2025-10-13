import { Controller, Get } from '@nestjs/common';
import { FetchAllUsersUseCase } from '@core/application/usecases/fetch-users';
import { UserResponse } from '../auth/dtos/user.response';

@Controller('users')
export class UsersController {
  constructor(
    private readonly fetchAllUsersUseCase: FetchAllUsersUseCase,
  ) {}

  @Get('all')
  async getAll() {
    const user = await this.fetchAllUsersUseCase.execute();
    return user.map(UserResponse.from)
  }
}
