import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import * as mongoose from 'mongoose';

@Injectable()
export class MongoHealthIndicator extends HealthIndicator implements OnModuleDestroy {
  private connections = new Map<string, mongoose.Connection>();

  async isHealthy(key: string, mongoUri: string): Promise<HealthIndicatorResult> {
    let conn = this.connections.get(mongoUri);
    try {
      if (!conn || conn.readyState !== 1) {
        conn = await mongoose.createConnection(mongoUri).asPromise();
        this.connections.set(mongoUri, conn);
      }
      await conn.db?.command({ ping: 1 });
      return this.getStatus(key, true);
    } catch (err) {
      this.connections.delete(mongoUri);
      throw new HealthCheckError(
        'MongoDB check failed',
        this.getStatus(key, false, { message: (err as Error).message }),
      );
    }
  }

  async onModuleDestroy() {
    for (const conn of this.connections.values()) {
      try {
        await conn.close();
      } catch {
        // ignore cleanup errors
      }
    }
  }
}
