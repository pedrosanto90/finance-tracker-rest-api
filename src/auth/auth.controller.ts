import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('users/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    // const user = await this.usersService.login(username, password);
    const data = await this.authService.signIn(username, password);
    if (data) {
      return { message: 'Login successful', data };
    }
    return { message: 'Invalid username or password' };
  }
}
