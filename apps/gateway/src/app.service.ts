import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor() {
    this.logger.debug('Hello World!', { message: 123});
  }
  getHello(): string {
    return 'Hello World!';
  }
}
