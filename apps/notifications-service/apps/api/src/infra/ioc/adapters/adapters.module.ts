import { Module } from '@nestjs/common';
import { TokenService } from '@core/domain/ports';
import { JwtTokenService } from '@core/infra/adapters/jwt-token-service';

@Module({
  providers: [
    {
      provide: TokenService,
      useClass: JwtTokenService,
    },
  ],
  exports: [TokenService],
})
export class AdaptersModule {}
