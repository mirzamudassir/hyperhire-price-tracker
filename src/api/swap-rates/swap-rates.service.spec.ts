import { Test, TestingModule } from '@nestjs/testing';
import { SwapRatesService } from './swap-rates.service';

describe('SwapRatesService', () => {
  let service: SwapRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwapRatesService],
    }).compile();

    service = module.get<SwapRatesService>(SwapRatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
