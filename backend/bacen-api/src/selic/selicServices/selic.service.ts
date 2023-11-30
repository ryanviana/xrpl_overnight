import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { format } from 'date-fns';

@Injectable()
export class SelicService {
  async getLatestSelicRate(dataInicial: Date, dataFinal: Date) {
    // Format the dates to Brazilian format (dd/MM/yyyy)
    const formattedDataInicial = format(dataInicial, 'dd/MM/yyyy');
    const formattedDataFinal = format(dataFinal, 'dd/MM/yyyy');

    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json&dataInicial=${formattedDataInicial}&dataFinal=${formattedDataFinal}`;
    console.log(url);
    const response = await axios.get(url);
    const responseData = response.data;
    console.log(responseData);

    // Ensure that responseData is not empty and has a 'valor' property
    if (responseData.length > 0 && responseData[0].hasOwnProperty('valor')) {
      return responseData[0].valor;
    } else {
      throw new Error('Invalid response data');
    }
  }
}
