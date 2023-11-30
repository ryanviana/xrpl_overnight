// src/profit-calculator/profit-calculator.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { SelicProfitCalculatorService } from './selicServices/selicProfitCaculator.service';

@Controller('profit-calculator')
export class SelicController {
  constructor(
    private selicProfitCalculatorService: SelicProfitCalculatorService,
  ) {}

  @Get()
  async calculateProfit(@Query('initialTimestamp') initialTimestamp: string) {
    return this.selicProfitCalculatorService.calculateProfit(initialTimestamp);
  }
}
