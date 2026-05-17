import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import * as Minio from 'minio';

@Injectable()
export class MinioHealthIndicator extends HealthIndicator {
  constructor(private readonly config: ConfigService) {
    super();
  }

  async isHealthy(key = 'minio'): Promise<HealthIndicatorResult> {
    try {
      const client = new Minio.Client({
        endPoint: this.config.get<string>('minio.endpoint') || 'localhost',
        port: this.config.get<number>('minio.port') || 9000,
        useSSL: this.config.get<boolean>('minio.useSSL') ?? false,
        accessKey: this.config.get<string>('minio.accessKey') || '',
        secretKey: this.config.get<string>('minio.secretKey') || '',
      });
      await client.listBuckets();
      return this.getStatus(key, true);
    } catch (err) {
      throw new HealthCheckError(
        'MinIO check failed',
        this.getStatus(key, false, { message: (err as Error).message }),
      );
    }
  }
}
