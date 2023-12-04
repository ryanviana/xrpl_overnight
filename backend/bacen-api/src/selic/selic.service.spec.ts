import { Test, TestingModule } from '@nestjs/testing';
import { SelicService } from './selicServices/selic.service';

describe('SelicService', () => {
  let service: SelicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SelicService],
    }).compile();

    service = module.get<SelicService>(SelicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
