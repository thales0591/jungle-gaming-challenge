import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { envSchema } from './env/env';
import { GatewayController } from '../modules/gateway.controller';
import { ProxyService } from '../modules/proxy/proxy.service';
import { JwtStrategy } from '../middlewares/passport/jwt.strategy';
import { JwtAuthGuard } from '../middlewares/passport/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    ProxyService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [GatewayController],
})
export class MainModule {}
