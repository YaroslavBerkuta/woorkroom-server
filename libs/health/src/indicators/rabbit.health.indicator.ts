import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

@Injectable()
export class RabbitMqHealthIndicator extends HealthIndicator {
  constructor(private readonly config: ConfigService) {
    super();
  }

  async isHealthy(key = 'rabbitmq'): Promise<HealthIndicatorResult> {
    const urls = this.config.get<string[]>('rmqp.urls');
    const url = urls?.[0];
    if (!url) {
      throw new HealthCheckError(
        'RabbitMQ not configured',
        this.getStatus(key, false, { message: 'rmqp.urls is empty' }),
      );
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const amqplib = require('amqplib') as {
        connect(url: string): Promise<{ close(): Promise<void> }>;
      };
      const conn = await amqplib.connect(url);
      await conn.close();
      return this.getStatus(key, true);
    } catch (err) {
      throw new HealthCheckError(
        'RabbitMQ check failed',
        this.getStatus(key, false, { message: (err as Error).message }),
      );
    }
  }
}
