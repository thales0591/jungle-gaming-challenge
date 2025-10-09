import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenRequest {
  @IsString({ message: 'RefreshToken must be a string.' })
  @IsNotEmpty({ message: 'RefreshToken is required.' })
  refreshToken: string;
}
