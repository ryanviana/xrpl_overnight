import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { format } from 'date-fns';

@Injectable()
export class SelicService {
  async getLatestSelicRate(initialDate: string) {
    const today = new Date();
    const finalDate = format(today, 'dd/MM/yyyy');

    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json&dataInicial=${initialDate}&dataFinal=${finalDate}`;
    const response = await axios.get(url);
    const responseData = response.data;

    if (responseData.length > 0 && responseData[0].hasOwnProperty('valor')) {
      return responseData;
    } else {
      throw new Error('Invalid response data');
    }
  }
}
