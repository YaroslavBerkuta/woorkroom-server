import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { GrpcModule } from 'woorkroom/grpc';
import { AuthorizationService } from './services';
import { AuthorizationController } from './controllers';
import { RedisModule } from 'woorkroom/redis';

@Module({
  imports: [ConfigurationModule, GrpcModule, RedisModule],
  controllers: [AuthorizationController],
  providers: [
    {
      provide: AuthorizationService.name,
      useClass: AuthorizationService,
    },
  ],
})
export class AuthorizationModule {}
