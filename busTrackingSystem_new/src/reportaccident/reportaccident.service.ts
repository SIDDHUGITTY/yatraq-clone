import { Injectable } from '@nestjs/common';
import { db } from 'src/db/db.connection';

import { reportaccident } from 'src/db/schema';

@Injectable()
export class ReportaccidentService {
  async create(
    name: string,
    latitude: number,
    longitude: number,
    bus_number: string,
    phone: string,
    description: string,
  ) {
    const result = await db
      .insert(reportaccident)
      .values({ name, latitude, longitude, bus_number, phone, description })
      .returning();
    return result;
  }
}
