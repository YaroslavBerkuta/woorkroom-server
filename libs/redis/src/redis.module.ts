import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  imports: [],
  providers: [
    {
      provide: RedisService.name,
      useClass: RedisService,
    },
  ],
  exports: [RedisService.name],
})
export class RedisModule {}
