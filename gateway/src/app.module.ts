import { Module } from '@nestjs/common';
import { LIBS_MODULES } from './libs';

@Module({
  imports: [...LIBS_MODULES],
})
export class AppModule {}
