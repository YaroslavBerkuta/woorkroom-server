import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { DataSource } from 'typeorm';

type PgKey = 'users' | 'companys' | 'projects';

@Injectable()
export class PostgresHealthIndicator extends HealthIndicator implements OnModuleDestroy {
  private sources = new Map<PgKey, DataSource>();

  constructor(private readonly config: ConfigService) {
    super();
  }

  async isHealthy(key: string, pgKey: PgKey): Promise<HealthIndicatorResult> {
    let ds = this.sources.get(pgKey);
    try {
      if (!ds || !ds.isInitialized) {
        const dbConfig = this.config.get<Record<string, unknown>>(`postgres.${pgKey}`) ?? {};
        ds = new DataSource({
          type: 'postgres',
          host: dbConfig['host'] as string,
          port: dbConfig['port'] as number,
          username: dbConfig['username'] as string,
          password: dbConfig['password'] as string,
          database: dbConfig['database'] as string,
          connectTimeoutMS: 3000,
        });
        await ds.initialize();
        this.sources.set(pgKey, ds);
      }
      await ds.query('SELECT 1');
      return this.getStatus(key, true);
    } catch (err) {
      if (ds?.isInitialized) {
        try { await ds.destroy(); } catch { /* ignore */ }
      }
      this.sources.delete(pgKey);
      throw new HealthCheckError(
        'PostgreSQL check failed',
        this.getStatus(key, false, { message: (err as Error).message }),
      );
    }
  }

  async onModuleDestroy() {
    for (const ds of this.sources.values()) {
      try {
        if (ds.isInitialized) await ds.destroy();
      } catch {
        // ignore cleanup errors
      }
    }
  }
}
