import { RedisModule } from '@nestjs-modules/ioredis';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_SERVICE } from './types';
import { provideService } from 'src/common';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
  ],
  providers: [provideService(REDIS_SERVICE, RedisService)],
  exports: [REDIS_SERVICE],
})
export class RedisCashModule implements OnModuleInit {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(RedisCashModule.name);
  }
  onModuleInit() {
    this.logger.debug('Redis module initialized');
  }
}
