import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { OwnerGuard } from '../guards/owner.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, OwnerGuard],
  exports: [UsersService], // Exporta para outros módulos poderem usar
})
export class UsersModule {}
