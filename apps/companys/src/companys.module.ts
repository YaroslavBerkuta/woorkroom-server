import { Module } from '@nestjs/common';
import { CompanysController } from './companys.controller';
import { CompanysService } from './companys.service';

@Module({
  imports: [],
  controllers: [CompanysController],
  providers: [CompanysService],
})
export class CompanysModule {}
