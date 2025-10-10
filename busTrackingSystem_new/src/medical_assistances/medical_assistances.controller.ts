import { Body, Controller, Post } from '@nestjs/common';
import { MedicalAssistancesService } from './medical_assistances.service';

@Controller('medical-assistances')
export class MedicalAssistancesController {
  constructor(private readonly service: MedicalAssistancesService) {}
  @Post('create')
  async createmedical(
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
    const result = await this.service.createmedicalReport(
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
