import { Module } from '@nestjs/common';
import { UsersModule } from './modules';
import { LIBS_MODULES } from './libs';

@Module({
  imports: [...LIBS_MODULES, UsersModule],
})
export class AppModule {}
