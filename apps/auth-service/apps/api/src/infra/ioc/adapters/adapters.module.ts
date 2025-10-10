import { Module } from '@nestjs/common';
import { Encrypter } from '@core/application/ports/encrypter';
import { BcryptEncrypter } from '@core/infra/adapters/bcrypt-encrypter';
import { AuthToken } from '@core/application/ports/auth-token';
import { JwtAdapter } from '@core/infra/adapters/jwt-adapter';
import { EventPublisher } from '@core/application/ports/event-publisher';
import { EventPublisherAdapter } from '../../messaging/event-publisher-adapter';
import { RmqModule } from '../../messaging/rmq.module';

@Module({
  imports: [RmqModule],
  providers: [
    {
      provide: Encrypter,
      useClass: BcryptEncrypter,
    },
    {
      provide: AuthToken,
      useClass: JwtAdapter,
    },
    {
      provide: EventPublisher,
      useClass: EventPublisherAdapter,
    },
  ],
  exports: [Encrypter, AuthToken, EventPublisher],
})
export class AdaptersModule {}
