import { Controller, Get, Param } from '@nestjs/common';
import { PricesService } from './prices.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get('hourly')
  @ApiOperation({ summary: 'Get hourly price of each hour' })
  async getHourlyPrices() {
    return await this.pricesService.getHourlyPrices('ethereum');
  }

  @Get('swap/:amount')
  @ApiOperation({ summary: 'Get swap rate ETH to BTC' })
  async getSwapPrice(@Param('amount') amount: number) {
    return await this.pricesService.getSwapRate(amount);
  }
}
