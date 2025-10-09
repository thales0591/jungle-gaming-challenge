import { Module } from '@nestjs/common';
import { Encrypter } from '@core/application/ports/encrypter';
import { BcryptEncrypter } from '@core/infra/adapters/bcrypt-encrypter';
import { AuthToken } from '@core/application/ports/auth-token';
import { JwtAdapter } from '@core/infra/adapters/jwt-adapter';

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: BcryptEncrypter,
    },
    {
      provide: AuthToken,
      useClass: JwtAdapter,
    },
  ],
  exports: [Encrypter, AuthToken],
})
export class AdaptersModule {}
