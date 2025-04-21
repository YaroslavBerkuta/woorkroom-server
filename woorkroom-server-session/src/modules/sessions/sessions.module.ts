import { Module } from '@nestjs/common';
import { PasswordHashService, SessionService } from './services';
import { SessionsResolver } from './resolvers';
import { RmqModule } from 'src/libs/rmq/rmq.module';
import { provideService } from 'src/common';
import { PASSWORD_HASH_SERVICE, SESSION_SERVICES } from './types';
import { RedisCashModule } from 'src/libs/redis/redis.module';

@Module({
  imports: [RmqModule, RedisCashModule],
  providers: [
    provideService(PASSWORD_HASH_SERVICE, PasswordHashService),
    provideService(SESSION_SERVICES, SessionService),
    SessionsResolver,
  ],
})
export class SessionsModule {}
