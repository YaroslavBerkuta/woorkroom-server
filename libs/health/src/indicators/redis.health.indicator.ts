import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { createClient } from 'redis';

type RedisClient = ReturnType<typeof createClient>;

@Injectable()
export class RedisHealthIndicator extends HealthIndicator implements OnModuleDestroy {
  private client: RedisClient | null = null;

  constructor(private readonly config: ConfigService) {
    super();
  }

  async isHealthy(key = 'redis'): Promise<HealthIndicatorResult> {
    try {
      if (!this.client || !this.client.isOpen) {
        const host = this.config.get<string>('redis.host');
        const port = this.config.get<number>('redis.port');
        const url = `redis://${host}:${port}`;
        this.client = createClient({ url });
        await this.client.connect();
      }
      await this.client.ping();
      return this.getStatus(key, true);
    } catch (err) {
      if (this.client?.isOpen) {
        try { await this.client.quit(); } catch { /* ignore */ }
      }
      this.client = null;
      throw new HealthCheckError(
        'Redis check failed',
        this.getStatus(key, false, { message: (err as Error).message }),
      );
    }
  }

  async onModuleDestroy() {
    if (this.client?.isOpen) {
      try { await this.client.quit(); } catch { /* ignore */ }
    }
  }
}
