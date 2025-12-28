import { Module } from '@nestjs/common';
import { AuthResolver } from './resolvers';
import { RabbitmqModule } from 'woorkroom/rabbitmq';

@Module({
  imports: [RabbitmqModule],
  providers: [AuthResolver],
})
export class AuthModule {}
