import { Controller, Post, Body, Get } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @ApiOperation({ summary: 'Set a price alert for a specific chain' })
  async createAlert(@Body() createAlertDto: CreateAlertDto) {
    return await this.alertsService.create(createAlertDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all price alerts' })
  async getAlerts() {
    return await this.alertsService.getAlerts();
  }
}
