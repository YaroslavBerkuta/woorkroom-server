import { Controller, Get } from '@nestjs/common';
import { CompanysService } from './companys.service';

@Controller()
export class CompanysController {
  constructor(private readonly companysService: CompanysService) {}

  @Get()
  getHello(): string {
    return this.companysService.getHello();
  }
}
