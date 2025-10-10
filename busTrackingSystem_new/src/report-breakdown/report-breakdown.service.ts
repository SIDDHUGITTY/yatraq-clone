import { Injectable } from '@nestjs/common';
import { db } from 'src/db/db.connection';
import { ReportBreakdown } from 'src/db/schema';

@Injectable()
export class ReportBreakdownService {
  async createReportBreakkdown(
    latitude: number,
    longitude: number,
    bus_number: string,
    phone: string,
    description: string,
  ) {
    const result = await db
      .insert(ReportBreakdown)
      .values({ latitude, longitude, bus_number, phone, description })
      .returning();
    return result;
  }
}
