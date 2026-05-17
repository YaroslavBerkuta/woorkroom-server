import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { GrpcModule } from 'woorkroom/grpc';
import { AuthorizationService } from '@/services';
import { AuthorizationController } from '@/controllers';
import { RedisModule } from 'woorkroom/redis';
import { RabbitmqModule } from 'woorkroom/rabbitmq';

@Module({
  imports: [ConfigurationModule, GrpcModule, RedisModule, RabbitmqModule],
  controllers: [AuthorizationController],
  providers: [
    {
      provide: AuthorizationService.name,
      useClass: AuthorizationService,
    },
  ],
})
export class AuthorizationModule {}
