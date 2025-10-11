import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { LoginUseCase, RefreshTokenUseCase } from '@core/application/usecases';
import { LoginRequest } from './dtos/login.request';
import { LoginResponse } from './dtos/login.response';
import { RegisterUseCase } from '@core/application/usecases/register';
import { RegisterRequest } from './dtos/register.request';
import { UserResponse } from './dtos/user.response';
import { RefreshTokenRequest } from './dtos/refresh.request';
import { GetMeUseCase } from '@core/application/usecases/get-me';
import { LoggedUserId } from '../../decorators/logged-user.decorator';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { VerifyTokenUseCase } from '@core/application/usecases/verify';
import { TokenDto } from './dtos/verify-token.request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly verifyTokenUseCase: VerifyTokenUseCase,
  ) {}
  @Post('login')
  async login(
    @Body() { email, password }: LoginRequest,
  ): Promise<LoginResponse> {
    const payload = await this.loginUseCase.execute({ email, password });
    return LoginResponse.from(payload.accessToken, payload.refreshToken);
  }

  @Post('register')
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
  async refresh(@Body() { refreshToken }: RefreshTokenRequest) {
    const payload = await this.refreshTokenUseCase.execute(refreshToken);
    return LoginResponse.from(payload.accessToken, payload.refreshToken);
  }

  @Post('verify')
  async verify(@Body() { token }: TokenDto) {
    const user = await this.verifyTokenUseCase.execute(token);
    return UserResponse.from(user);
  }

  @Get('me')
  async getMe(@LoggedUserId() id: string) {
    const user = await this.getMeUseCase.execute(UniqueId.create(id));
    return UserResponse.from(user);
  }
}
