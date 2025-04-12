import { Global, Logger, Module, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule implements OnModuleInit {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(DatabaseModule.name);
  }
  onModuleInit() {
    this.logger.debug('Database module initialized');
  }
}
