import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { TokenService, TokenPayload } from '@core/domain/ports/token-service';

@Injectable()
export class JwtTokenService extends TokenService {
  private readonly jwtSecret: string;

  constructor(private readonly configService: ConfigService) {
    super();
    this.jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
  }

  async verify(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return decoded as TokenPayload;
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  decode(token: string): TokenPayload | null {
    try {
      const decoded = jwt.decode(token);
      return decoded as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}
