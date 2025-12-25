import { Module } from '@nestjs/common';
import { UserQueryResolver } from './resolvers';
import { RabbitmqModule } from 'woorkroom/rabbitmq';

@Module({
  imports: [RabbitmqModule],
  providers: [UserQueryResolver],
})
export class UsersModule {}
