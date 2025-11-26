import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from 'woorkroom/database';

@Controller()
export class AppController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('ping')
  async ping() {
    const result = await this.databaseService.ping();
    return { status: result ? 'ok' : 'error' };
  }
}
