import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginUseCase, RefreshTokenUseCase } from '@core/application/usecases';
import { LoginRequest } from './dtos/login.request';
import { LoginResponse } from './dtos/login.response';
import { RegisterUseCase } from '@core/application/usecases/register';
import { RegisterRequest } from './dtos/register.request';
import { UserResponse } from './dtos/user.response';
import { RefreshTokenRequest } from './dtos/refresh.request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() { email, password }: LoginRequest,
  ): Promise<LoginResponse> {
    const payload = await this.loginUseCase.execute({ email, password });
    return LoginResponse.from(payload.accessToken, payload.refreshToken);
  }

  @Post('register')
  @HttpCode(200)
  async register(
    @Body() { email, username, password }: RegisterRequest,
  ): Promise<UserResponse> {
    const user = await this.registerUseCase.execute({
      email,
      name: username,
      password,
    });
    return UserResponse.from(user);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() { refreshToken }: RefreshTokenRequest) {
    const payload = await this.refreshTokenUseCase.execute(refreshToken);
    return LoginResponse.from(payload.accessToken, payload.refreshToken);
  }
}
