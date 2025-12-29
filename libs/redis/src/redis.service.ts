import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { IRedisService } from './types';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class RedisService
  implements IRedisService, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisService.name);
  private client!: RedisClientType;
  constructor(private readonly config: ConfigService) {}
  async onModuleDestroy() {
    if (this.client?.isOpen) {
      await this.client.quit();
      this.logger.log('Redis connection closed');
    }
  }
  async onModuleInit() {
    const host = this.config.get<string>('redis.host');
    const port = this.config.get<number>('redis.port');
    let url = this.config.get<string>('redis.url');

    if (!host || !port) {
      throw new Error('Missing redis.host or redis.port');
    }

    if (!url) {
      url = `redis://${host}:${port}`;
    }

    this.logger.log(`Redis url: ${url}`);

    this.client = createClient({ url });
    this.client.on('connect', () => this.logger.log('Redis connected'));

    this.client.on('error', (err) => this.logger.error('Redis error', err));

    await this.client.connect();
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (value === null) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    const payload = typeof value === 'string' ? value : JSON.stringify(value);

    await this.client.set(key, payload);
  }

  async ttl<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const payload = typeof value === 'string' ? value : JSON.stringify(value);

    await this.client.set(key, payload, {
      EX: ttlSeconds,
    });
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  sadd(key: string, value: string) {
    return this.client.sAdd(key, value);
  }

  smembers(key: string) {
    return this.client.sMembers(key);
  }

  srem(key: string, value: string) {
    return this.client.sRem(key, value);
  }
}
