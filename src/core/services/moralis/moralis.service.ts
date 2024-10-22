import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';

@Injectable()
export class MoralisService implements OnModuleInit {
  constructor() {}
  private readonly logger = new Logger(MoralisService.name);
  private static isInitialized = false;

  async onModuleInit() {
    if (!MoralisService.isInitialized) {
      try {
        await Moralis.start({
          apiKey: process.env.MORALIS_API_KEY,
        });
        MoralisService.isInitialized = true;
        this.logger.log('Moralis initialized successfully.');
      } catch (error) {
        this.logger.error('Error initializing Moralis:', error);
        throw error;
      }
    } else {
      this.logger.log('Moralis has already been initialized.');
    }
  }

  async getPrice(address: any): Promise<any> {
    const chain = EvmChain.ETHEREUM;
    const tokens: { tokenAddress: string }[] = address;

    const response = await Moralis.EvmApi.token.getMultipleTokenPrices(
      {
        chain,
      },
      {
        tokens,
      },
    );

    return response.raw;
  }
}
