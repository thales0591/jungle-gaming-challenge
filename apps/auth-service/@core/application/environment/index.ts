export class Environment {
  static get auth() {
    return {
      secret: String(process.env.AUTH_SECRET),
      refreshSecret: String(process.env.AUTH_REFRESH_SECRET),
      authExpirationInSeconds: Number(
        process.env.AUTH_ACCESS_EXPIRATION_SECONDS,
      ),
      refreshExpirationInSeconds: Number(
        process.env.AUTH_REFRESH_EXPIRATION_SECONDS,
      ),
    };
  }
}
