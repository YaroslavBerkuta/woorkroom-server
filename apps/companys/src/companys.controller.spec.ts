import { Test, TestingModule } from '@nestjs/testing';
import { CompanysController } from './companys.controller';
import { CompanysService } from './companys.service';

describe('CompanysController', () => {
  let companysController: CompanysController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CompanysController],
      providers: [CompanysService],
    }).compile();

    companysController = app.get<CompanysController>(CompanysController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(companysController.getHello()).toBe('Hello World!');
    });
  });
});
