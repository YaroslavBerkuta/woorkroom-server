import { Module } from '@nestjs/common';
import { RabbitmqModule } from 'woorkroom/rabbitmq';
import { CompanysResolver } from './resolvers';

@Module({
  imports: [RabbitmqModule],
  providers: [CompanysResolver],
  exports: [CompanysResolver],
})
export class CompanysModule {}
