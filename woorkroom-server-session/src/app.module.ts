import { Module } from '@nestjs/common';
import { LIBS_MODULES } from './libs';
import { SessionsModule } from './modules';

@Module({
  imports: [...LIBS_MODULES, SessionsModule],
})
export class AppModule {}
