import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from 'woorkroom/database';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
