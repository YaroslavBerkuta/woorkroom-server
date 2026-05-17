import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { RedisHealthIndicator } from './indicators/redis.health.indicator';
import { RabbitMqHealthIndicator } from './indicators/rabbit.health.indicator';
import { MinioHealthIndicator } from './indicators/minio.health.indicator';
import { MongoHealthIndicator } from './indicators/mongo.health.indicator';
import { PostgresHealthIndicator } from './indicators/postgres.health.indicator';

@Module({
  imports: [TerminusModule, HttpModule],
  providers: [
    RedisHealthIndicator,
    RabbitMqHealthIndicator,
    MinioHealthIndicator,
    MongoHealthIndicator,
    PostgresHealthIndicator,
  ],
  exports: [
    TerminusModule,
    HttpModule,
    RedisHealthIndicator,
    RabbitMqHealthIndicator,
    MinioHealthIndicator,
    MongoHealthIndicator,
    PostgresHealthIndicator,
  ],
})
export class HealthModule {}
