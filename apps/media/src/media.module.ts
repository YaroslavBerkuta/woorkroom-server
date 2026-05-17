import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { MediaController } from './controllers';
import { MediaService } from './services';
import { MediaHealthModule } from './health/health.module';

@Module({
  imports: [ConfigurationModule, MediaHealthModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
