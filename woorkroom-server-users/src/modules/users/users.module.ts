import { Module } from '@nestjs/common';
import { UsersService } from './services';
import { UsersResolver } from './users.resolver';
import { UsersController } from './controllers';

@Module({
  imports: [],
  controllers:[UsersController],
  providers: [UsersService, UsersResolver],
})
export class UsersModule {}
