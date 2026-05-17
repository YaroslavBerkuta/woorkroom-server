import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MediaProxyController } from './media-proxy.controller';

@Module({
  imports: [HttpModule],
  controllers: [MediaProxyController],
})
export class MediaProxyModule {}
