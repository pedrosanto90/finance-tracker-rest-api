import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  access_token: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
