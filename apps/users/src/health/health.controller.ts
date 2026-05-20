import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PostgresHealthIndicator } from 'woorkroom/health';

@Controller('health')
export class UsersHealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly postgres: PostgresHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.postgres.isHealthy('postgres', 'users'),
    ]);
  }
}
