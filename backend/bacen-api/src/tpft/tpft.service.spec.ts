import { Test, TestingModule } from '@nestjs/testing';
import { TpftService } from './tpft.service';

describe('TpftService', () => {
  let service: TpftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TpftService],
    }).compile();

    service = module.get<TpftService>(TpftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
