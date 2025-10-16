export class Environment {
  static get auth() {
    return {
      secret: String(process.env.JWT_SECRET),
      expirationInSeconds: Number(process.env.JWT_TOKEN_EXPIRATION_SECONDS),
    };
  }
}
