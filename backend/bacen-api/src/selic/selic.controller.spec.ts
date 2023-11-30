import { Test, TestingModule } from '@nestjs/testing';
import { SelicController } from './selic.controller';
import { SelicService } from './selicServices/selic.service';

describe('SelicController', () => {
  let controller: SelicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SelicController],
      providers: [SelicService],
    }).compile();

    controller = module.get<SelicController>(SelicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
