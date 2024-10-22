import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CoinMarketCapService {
  constructor() {}

  async getSwapPrice(
    amount: number,
    swapFrom: number,
    swapTo: string,
  ): Promise<any> {
    const response = await axios.get(
      `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=${amount}&id=${swapFrom}&convert=${swapTo}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_API_KEY,
        },
      },
    );

    return response.data;
  }
}
