import { Module } from '@nestjs/common';
import { UsersService } from './services';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [],
  providers: [UsersService, UsersResolver],
})
export class UsersModule {}
