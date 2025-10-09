import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Environment } from '@core/application/environment';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Environment.auth.secret,
    });
  }

  async validate(payload: any) {
    const {
      userId: { value: userId },
      role,
    } = payload;
    return {
      userId,
      role,
    };
  }
}
