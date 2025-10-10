import { Injectable } from '@nestjs/common';
import { db } from 'src/db/db.connection';
import { medicalAssistances } from 'src/db/schema';

@Injectable()
export class MedicalAssistancesService {
  async createmedicalReport(
    name: string,
    issues: string,
    latitude: number,
    longitude: number,
    bus_number: string,
    phone: string,
    description: string,
  ) {
    const result = await db
      .insert(medicalAssistances)
      .values({
        name,
        issues,
        latitude,
        longitude,
        bus_number,
        phone,
        description,
      })
      .returning();
    return result;
  }
}
