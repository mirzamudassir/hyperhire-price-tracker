import { Test, TestingModule } from '@nestjs/testing';
import { SwapRatesController } from './swap-rates.controller';
import { SwapRatesService } from './swap-rates.service';

describe('SwapRatesController', () => {
  let controller: SwapRatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwapRatesController],
      providers: [SwapRatesService],
    }).compile();

    controller = module.get<SwapRatesController>(SwapRatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
