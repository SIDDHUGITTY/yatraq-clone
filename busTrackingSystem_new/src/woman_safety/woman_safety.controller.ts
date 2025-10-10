import { Body, Controller, Post } from '@nestjs/common';
import { WomanSafetyService } from './woman_safety.service';

@Controller('woman-safety')
export class WomanSafetyController {
  constructor(private readonly service: WomanSafetyService) {}
  @Post('create')
  async createReport(
    @Body()
    body: {
      name: string;
      issues: string;
      latitude: string;
      longitude: string;
      bus_number: string;
      phone: string;
      description: string;
    },
  ) {
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);
    const result = await this.service.cresteReport(
      body.name,
      body.issues,
      latitude,
      longitude,
      body.bus_number,
      body.phone,
      body.description,
    );
    return result;
  }
}
