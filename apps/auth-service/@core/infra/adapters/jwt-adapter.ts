import {
  AuthToken,
  GenerateTokenProps,
  ValidateTokenProps,
} from '@core/application/ports/auth-token';
import jwt from 'jsonwebtoken';

export class JwtAdapter extends AuthToken {
  public async generate<Payload>({
    secret,
    expiresAt,
    payload,
  }: GenerateTokenProps<Payload>): Promise<string> {
    if (expiresAt) {
      const now = new Date();
      const expiresIn = Math.floor(
        (expiresAt.getTime() - now.getTime()) / 1000,
      );

      return jwt.sign(payload as object, secret, { expiresIn });
    }

    return jwt.sign(payload as object, secret);
  }

  public async validate<Payload>({
    token,
    secret,
  }: ValidateTokenProps): Promise<Payload> {
    return jwt.verify(token, secret) as Payload;
  }
}
