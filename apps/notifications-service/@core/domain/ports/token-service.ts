export interface TokenPayload {
  userId: string;
  [key: string]: any;
}

export abstract class TokenService {
  abstract verify(token: string): Promise<TokenPayload>;
  abstract decode(token: string): TokenPayload | null;
}
