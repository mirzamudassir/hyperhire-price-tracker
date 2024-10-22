import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Price } from './entities/price.entity';
import { ConfigService } from '@nestjs/config';
import { MoralisService } from 'src/core/services/moralis/moralis.service';
import { CoinMarketCapService } from 'src/core/services/coinMarketCap/coinMarket.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AlertsService } from '../alerts/alerts.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    private configService: ConfigService,
    private readonly moralisService: MoralisService,
    private readonly coinMarketCapService: CoinMarketCapService,
    private readonly alertsService: AlertsService,
    private readonly mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchAndSavePrices() {
    const tokenPrices = await this.getPriceFromAPI();
    const ethPrice = tokenPrices[0];
    const maticPrice = tokenPrices[1];

    await this.priceRepository.save([
      { chain: 'ethereum', price: ethPrice.usdPrice }, //price is in USD
      { chain: 'polygon', price: maticPrice.usdPrice }, //price is in USD
    ]);

    // Check price alert for Ethereum
    try {
      await this.checkPriceAlert('ethereum', ethPrice.usdPrice);
    } catch (error) {
      console.error('Error checking Ethereum price alert:', error);
    }

    // Check price alert for Polygon
    try {
      await this.checkPriceAlert('polygon', maticPrice.usdPrice);
    } catch (error) {
      console.error('Error checking Polygon price alert:', error);
    }

    return [ethPrice.usdPrice, maticPrice.usdPrice];
  }

  private async getPriceFromAPI(): Promise<any> {
    try {
      const tokenAddresses = [
        {
          tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // ETH address
        },
        {
          tokenAddress: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0', // MATIC address
        },
      ];

      const response = await this.moralisService.getPrice(tokenAddresses);

      return response;
    } catch (error) {
      // Log the error for debugging
      console.error('Error fetching price from API:', error);
      throw new InternalServerErrorException('Failed to fetch price from API');
    }
  }

  async getSwapRate(amount: number): Promise<any> {
    try {
      const response = await this.coinMarketCapService.getSwapPrice(
        amount,
        1027,
        'BTC',
      );

      const ethToBtcRate = response.data.quote.BTC.price;

      const btcAmount = amount * ethToBtcRate;
      const fee = amount * 0.03;

      return {
        btcAmount,
        fee: { eth: fee, usd: fee * ethToBtcRate },
      };
    } catch (error) {
      // Log the error for debugging
      console.error('Error fetching Swap Rate from API:', error);
      throw new InternalServerErrorException('Failed to fetch price from API');
    }
  }

  // Fetch prices for each hour within the last 24 hours
  async getHourlyPrices(
    chain: string,
  ): Promise<{ time: string; price: number }[]> {
    const now = new Date();
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(now.getHours() - 24);

    // Query all prices from the last 24 hours
    const prices = await this.priceRepository
      .createQueryBuilder('price')
      .where('price.chain = :chain', { chain })
      .andWhere('price.timestamp >= :twentyFourHoursAgo', {
        twentyFourHoursAgo,
      })
      .orderBy('price.timestamp', 'ASC')
      .getMany();

    // Group prices by hour
    const hourlyPrices: { time: string; price: number }[] = [];
    for (let i = 0; i < 24; i++) {
      const hourStart = new Date(twentyFourHoursAgo);
      hourStart.setHours(hourStart.getHours() + i);

      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourEnd.getHours() + 1);

      // Find the first price in the current hour range
      const priceInHour = prices.find(
        (price) => price.timestamp >= hourStart && price.timestamp < hourEnd,
      );
      if (priceInHour) {
        hourlyPrices.push({
          time: hourStart.toISOString(),
          price: priceInHour.price,
        });
      } else {
        // If no price was found, we can return null or 0 for that hour
        hourlyPrices.push({
          time: hourStart.toISOString(),
          price: 0,
        });
      }
    }

    return hourlyPrices;
  }

  private async checkPriceAlert(chain: string, currentPrice: number) {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const lastHourPrice = await this.priceRepository.findOne({
      where: { chain, timestamp: MoreThan(oneHourAgo) },
      order: { timestamp: 'ASC' },
    });

    //check for reegistered alets first
    const alerts = await this.alertsService.getAlerts();
    for (const alert of alerts) {
      if (currentPrice >= alert.price) {
        await this.sendAlertEmail(alert.email, chain, currentPrice);
      }
    }

    //check for price change alert
    if (
      lastHourPrice &&
      (currentPrice - lastHourPrice.price) / lastHourPrice.price >= 0.03
    ) {
      const defaultEmail = 'hyperhire_assignment@hyperhire.in'; //for testing
      this.sendAlertEmail(defaultEmail, chain, currentPrice);
    }
  }

  private async sendAlertEmail(email: string, chain: string, price: number) {
    await this.mailerService.sendMail({
      to: email,
      subject: `${chain} price alert!`,
      text: `The price of ${chain} has increased by more than 3%. Current price: ${price} USD`,
      context: {
        name: email,
      },
    });
  }
}
