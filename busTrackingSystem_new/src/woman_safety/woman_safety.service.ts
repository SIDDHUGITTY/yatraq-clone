import { Injectable } from '@nestjs/common';
import { db } from 'src/db/db.connection';
import { womansafty } from 'src/db/schema';

@Injectable()
export class WomanSafetyService {
  async cresteReport(
    name: string,
    issues: string,
    latitude: number,
    longitude: number,
    bus_number: string,
    phone: string,
    description: string,
  ) {
    const result = await db
      .insert(womansafty)
      .values({
        name,
        issues,
        bus_number,
        latitude,
        longitude,
        phone,
        description,
      })
      .returning();
    return result;
  }
}
