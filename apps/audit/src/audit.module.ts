import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { MongoModule } from 'woorkroom/mongo';
import { AuditController } from './controllers';
import { AuditService } from './services';
import { AuditEvent, AuditEventSchema } from './schemas/audit-event.schema';
import { AuditHealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigurationModule,
    MongoModule.forAudit([{ name: AuditEvent.name, schema: AuditEventSchema }]),
    AuditHealthModule,
  ],
  controllers: [AuditController],
  providers: [AuditService],
})
export class AuditModule {}
