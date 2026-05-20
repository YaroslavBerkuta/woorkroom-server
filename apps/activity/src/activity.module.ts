import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { MongoModule } from 'woorkroom/mongo';
import { ActivityController } from './controllers';
import { ActivityService } from './services';
import {
  ActivityEvent,
  ActivityEventSchema,
} from './schemas/activity-event.schema';
import { ActivityHealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigurationModule,
    MongoModule.forActivity([
      { name: ActivityEvent.name, schema: ActivityEventSchema },
    ]),
    ActivityHealthModule,
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
