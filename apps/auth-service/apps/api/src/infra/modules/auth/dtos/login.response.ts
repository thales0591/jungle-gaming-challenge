export class LoginResponse {
  private constructor(
    readonly accessToken: string,
    readonly refreshToken: string,
  ) {}

  static from(accessToken: string, refreshToken: string): LoginResponse {
    return new LoginResponse(accessToken, refreshToken);
  }
}
