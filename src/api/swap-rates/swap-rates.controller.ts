import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SwapRatesService } from './swap-rates.service';
import { CreateSwapRateDto } from './dto/create-swap-rate.dto';
import { UpdateSwapRateDto } from './dto/update-swap-rate.dto';

@Controller('swap-rates')
export class SwapRatesController {
  constructor(private readonly swapRatesService: SwapRatesService) {}

  @Post()
  create(@Body() createSwapRateDto: CreateSwapRateDto) {
    return this.swapRatesService.create(createSwapRateDto);
  }

  @Get()
  findAll() {
    return this.swapRatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.swapRatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSwapRateDto: UpdateSwapRateDto) {
    return this.swapRatesService.update(+id, updateSwapRateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.swapRatesService.remove(+id);
  }
}
