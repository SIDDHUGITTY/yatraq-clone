import { Body, Controller, Post } from '@nestjs/common';
import { ReportaccidentService } from './reportaccident.service';

@Controller('reportaccident')
export class ReportaccidentController {
  constructor(private readonly service: ReportaccidentService) {}
  @Post('create')
  async createreport(
    @Body()
    body: {
      name: string;
      latitude: string;
      longitude: string;
      bus_number: string;
      phone: string;
      description: string;
    },
  ) {
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);
    const result = await this.service.create(
      body.name,
      latitude,
      longitude,
      body.bus_number,
      body.phone,
      body.description,
    );
    return result;
  }
}
