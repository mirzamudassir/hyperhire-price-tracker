import { Module } from '@nestjs/common';
import { SwapRatesService } from './swap-rates.service';
import { SwapRatesController } from './swap-rates.controller';

@Module({
  controllers: [SwapRatesController],
  providers: [SwapRatesService],
})
export class SwapRatesModule {}
