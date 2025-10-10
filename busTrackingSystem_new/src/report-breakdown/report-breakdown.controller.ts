import { Body, Controller, Post } from '@nestjs/common';
import { ReportBreakdownService } from './report-breakdown.service';

@Controller('report-breakdown')
export class ReportBreakdownController {
  constructor(private readonly service: ReportBreakdownService) {}
  @Post('create')
  async createReportbreakdown(
    @Body()
    body: {
      latitude: string;
      longitude: string;
      bus_number: string;
      phone: string;
      description: string;
    },
  ) {
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);
    const result = await this.service.createReportBreakkdown(
      latitude,
      longitude,
      body.bus_number,
      body.phone,
      body.description,
    );
    return result;
  }
}
