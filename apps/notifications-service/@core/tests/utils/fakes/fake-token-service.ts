import { TokenService, TokenPayload } from '@core/domain/ports/token-service';

export class FakeTokenService extends TokenService {
  private tokens: Map<string, TokenPayload> = new Map();

  async verify(token: string): Promise<TokenPayload> {
    const payload = this.tokens.get(token);
    if (!payload) {
      throw new Error('Invalid token');
    }
    return payload;
  }

  decode(token: string): TokenPayload | null {
    return this.tokens.get(token) || null;
  }

  generateToken(payload: TokenPayload): string {
    const token = `fake-token-${payload.userId}`;
    this.tokens.set(token, payload);
    return token;
  }

  clear(): void {
    this.tokens.clear();
  }
}
