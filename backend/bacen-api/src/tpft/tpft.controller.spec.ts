import { Test, TestingModule } from '@nestjs/testing';
import { TpftController } from './tpft.controller';
import { TpftService } from './tpft.service';

describe('TpftController', () => {
  let controller: TpftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TpftController],
      providers: [TpftService],
    }).compile();

    controller = module.get<TpftController>(TpftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
