// src/profit-calculator/profit-calculator.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { SelicProfitCalculatorService } from './selicServices/selicProfitCaculator.service';

@Controller('selic-profit-calculator')
export class SelicController {
  constructor(
    private selicProfitCalculatorService: SelicProfitCalculatorService,
  ) {}

  @Get()
  async calculateProfit(
    @Query('initialDate') initialDate: string,
    @Query('initialPrice') initialPrice: number,
  ) {
    return this.selicProfitCalculatorService.calculateProfit(
      initialDate,
      initialPrice,
    );
  }
}
