import { Injectable } from '@nestjs/common';
import { differenceInCalendarDays } from 'date-fns';
import { SelicService } from './selic.service';

@Injectable()
export class SelicProfitCalculatorService {
  constructor(private selicService: SelicService) {}

  async calculateProfit(
    initialTimestamp: string,
  ): Promise<{ profitReais: number; profitPercentage: number }> {
    const initialDate = new Date(initialTimestamp);
    const today = new Date();
    const daysCount = differenceInCalendarDays(today, initialDate);

    // Get selic rate for the period
    const selicRate = await this.selicService.getLatestSelicRate(
      initialDate,
      today,
    );

    // Calculate profit
    const profitPercentage = selicRate * daysCount;
    const profitReais = profitPercentage / 100;
    return { profitReais, profitPercentage };
  }
}
