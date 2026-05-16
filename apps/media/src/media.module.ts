import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { MediaController } from './controllers';
import { MediaService } from './services';

@Module({
  imports: [ConfigurationModule],
  controllers: [MediaController],
  providers: [
    {
      provide: MediaService.name,
      useClass: MediaService,
    },
  ],
})
export class MediaModule {}
