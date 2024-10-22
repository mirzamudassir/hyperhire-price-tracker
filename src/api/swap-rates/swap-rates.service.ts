import { Injectable } from '@nestjs/common';
import { CreateSwapRateDto } from './dto/create-swap-rate.dto';
import { UpdateSwapRateDto } from './dto/update-swap-rate.dto';

@Injectable()
export class SwapRatesService {
  create(createSwapRateDto: CreateSwapRateDto) {
    return 'This action adds a new swapRate';
  }

  findAll() {
    return `This action returns all swapRates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} swapRate`;
  }

  update(id: number, updateSwapRateDto: UpdateSwapRateDto) {
    return `This action updates a #${id} swapRate`;
  }

  remove(id: number) {
    return `This action removes a #${id} swapRate`;
  }
}
