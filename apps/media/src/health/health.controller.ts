import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { MinioHealthIndicator } from 'woorkroom/health';

@Controller('health')
export class MediaHealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly minio: MinioHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.minio.isHealthy('minio')]);
  }
}
