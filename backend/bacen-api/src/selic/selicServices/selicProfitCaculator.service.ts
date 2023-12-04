import { Injectable } from '@nestjs/common';
import { differenceInCalendarDays } from 'date-fns';
import { SelicService } from './selic.service';

@Injectable()
export class SelicProfitCalculatorService {
  constructor(private selicService: SelicService) {}

  async calculateProfit(
    initialDate: string,
    initialPrice: number,
  ): Promise<{
    profitReais: number;
    profitPercentage: number;
    blockchainValues: number;
  }> {
    const selicRates = await this.selicService.getLatestSelicRate(initialDate);

    let totalProfitPercentage = 1;

    selicRates.forEach((rate) => {
      const dailyRate = 1 + parseFloat(rate.valor) * 0.01;
      totalProfitPercentage *= dailyRate;
    });

    console.log(totalProfitPercentage);

    const profitPercentage = (totalProfitPercentage - 1) * 100;

    const principalAmount = initialPrice; // Replace with the actual principal amount
    const profitReais = principalAmount * (totalProfitPercentage - 1);
    const blockchainValues = profitReais * Math.floor(Math.pow(10, 18));

    return { profitReais, profitPercentage, blockchainValues };
  }
}
