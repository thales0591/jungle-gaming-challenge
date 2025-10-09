import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterRequest {
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;

  @IsString({ message: 'Username must be a string.' })
  @MinLength(3, { message: 'Username must be at least 3 characters long.' })
  @MaxLength(30, { message: 'Username must not exceed 30 characters.' })
  username: string;

  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;
}
