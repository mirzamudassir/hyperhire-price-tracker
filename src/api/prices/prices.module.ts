import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MoralisService } from 'src/core/services/moralis/moralis.service';
import { CoinMarketCapService } from 'src/core/services/coinMarketCap/coinMarket.service';
import { AlertsService } from '../alerts/alerts.service';
import { Alert } from '../alerts/entities/alert.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Price, ConfigModule, Alert]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get('MAIL_FROM')}>`,
        },
      }),
    }),
  ],
  controllers: [PricesController],
  providers: [
    PricesService,
    MoralisService,
    CoinMarketCapService,
    AlertsService,
  ],
  exports: [PricesService],
})
export class PricesModule {}
