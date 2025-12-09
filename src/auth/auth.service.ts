import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<LoginDto | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      // generate and return a token or session here
      const payload = { username: user.username, sub: user.id };
      const access_token = this.jwtService.sign(payload);
      const loginData = {
        access_token,
        userId: result.id,
        username: result.username,
        email: result.email,
      };
      return loginData;
    }
    return null;
  }
}
