import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { parseTime, TimeString } from 'src/common';
import { decode, encode } from 'js-base64';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setWithTTL(key: string, value: string, ttl: TimeString): Promise<void> {
    const exist = this.get(key);

    if (exist) {
      await this.delete(key);
    }

    const formattedTTL = parseTime(ttl, 's');
    await this.redis.set(key, encode(value), 'EX', formattedTTL);
  }

  async set(key: string, value: string): Promise<void> {
    const exist = this.get(key);

    if (exist) {
      await this.delete(key);
    }

    await this.redis.set(key, encode(value));
  }

  async get(key: string): Promise<string | null> {
    const value = await this.redis.get(key);
    return decode(value || '');
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
