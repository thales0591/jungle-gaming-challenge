import { Module } from '@nestjs/common';
import { AdaptersModule } from '../adapters/adapters.module';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from '@core/domain/ports/user-repository';
import { Encrypter } from '@core/application/ports/encrypter';
import {
  LoginUseCase,
  RefreshTokenUseCase,
  RegisterUseCase,
} from '@core/application/usecases';
import { AuthToken } from '@core/application/ports/auth-token';
import { EventPublisher } from '@core/application/ports/event-publisher';
import { GetMeUseCase } from '@core/application/usecases/get-me';
import { VerifyTokenUseCase } from '@core/application/usecases/verify';
import { ConfigService } from '@nestjs/config';
import { FetchAllUsersUseCase } from '@core/application/usecases/fetch-users';

@Module({
  imports: [AdaptersModule, DatabaseModule],
  providers: [
    {
      provide: LoginUseCase,
      useFactory: (
        repository: UserRepository,
        encrypter: Encrypter,
        tokenManager: AuthToken,
      ) => {
        return new LoginUseCase(repository, encrypter, tokenManager);
      },
      inject: [UserRepository, Encrypter, AuthToken],
    },
    {
      provide: RegisterUseCase,
      useFactory: (
        repository: UserRepository,
        encrypter: Encrypter,
        eventPublisher: EventPublisher,
      ) => {
        return new RegisterUseCase(repository, encrypter, eventPublisher);
      },
      inject: [UserRepository, Encrypter, EventPublisher],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (repository: UserRepository, tokenManager: AuthToken) => {
        return new RefreshTokenUseCase(repository, tokenManager);
      },
      inject: [UserRepository, AuthToken],
    },
    {
      provide: GetMeUseCase,
      useFactory: (repository: UserRepository) => {
        return new GetMeUseCase(repository);
      },
      inject: [UserRepository],
    },
    {
      provide: VerifyTokenUseCase,
      useFactory: (
        tokenManager: AuthToken,
        repository: UserRepository,
        configService: ConfigService,
      ) => {
        const authSecret = configService.getOrThrow<string>('AUTH_SECRET');
        return new VerifyTokenUseCase(tokenManager, repository, authSecret);
      },
      inject: [AuthToken, UserRepository, ConfigService],
    },
    {
      provide: FetchAllUsersUseCase,
      useFactory: (
        repository: UserRepository,
      ) => {
        return new FetchAllUsersUseCase(repository);
      },
      inject: [UserRepository],
    },    
  ],
  exports: [
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    GetMeUseCase,
    VerifyTokenUseCase,
    FetchAllUsersUseCase
  ],
})
export class UseCasesModule {}
