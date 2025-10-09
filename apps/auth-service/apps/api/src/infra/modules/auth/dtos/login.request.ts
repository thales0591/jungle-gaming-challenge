import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginRequest {
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
