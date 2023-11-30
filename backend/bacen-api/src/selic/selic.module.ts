import { Module } from '@nestjs/common';
import { SelicService } from './selicServices/selic.service';
import { SelicController } from './selic.controller';
import { SelicProfitCalculatorService } from './selicServices/selicProfitCaculator.service';

@Module({
  controllers: [SelicController],
  providers: [SelicService, SelicProfitCalculatorService],
})
export class SelicModule {}
