import {
  AuthToken,
  GenerateTokenProps,
  ValidateTokenProps,
} from '@core/application/ports/auth-token';

export class FakeAuthToken implements AuthToken {
  private tokens = new Map<string, any>(); // token -> payload
  private counter = 0;

  async generate<Payload>({
    payload,
  }: GenerateTokenProps<Payload>): Promise<string> {
    const token = `fake-token-${JSON.stringify(payload)}-${Date.now()}-${this.counter++}`;
    this.tokens.set(token, payload);
    return token;
  }

  async validate<Payload>({ token }: ValidateTokenProps): Promise<Payload> {
    const payload = this.tokens.get(token);
    if (!payload) {
      throw new Error('Invalid token');
    }
    return payload as Payload;
  }
}
