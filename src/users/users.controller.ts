import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDto.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() userData: CreateUserDto) {
    const newUser = await this.usersService.create(userData);
    const { password, ...user } = newUser;
    return { message: 'User created', user: user };
  }

  @Get()
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return users.map(({ password, ...user }) => user);
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);
    if (user) {
      const { password, ...userData } = user;
      return userData;
    }
    return { message: 'User not found' };
  }

  @Post('user')
  async getUserByUsername(@Query('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (user) {
      const { password, ...userData } = user;
      return userData;
    }
    return { message: 'User not found' };
  }

  @Put(':id')
  async updatePassword(
    @Param('id') id: number,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      await this.usersService.updatePassword(id, oldPassword, newPassword);
      return { message: 'Password updated successfully' };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Delete(':id/delete')
  async deleteUser(@Param('id') id: number) {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
