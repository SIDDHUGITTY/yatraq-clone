import { Injectable } from '@nestjs/common';
import { LiveTrackingGateway } from './live-tracking.gateway';
import { TrackingData } from './dto/tracking-data.dto';
import { db } from 'src/db/db.connection';
import { bus_live_tracking } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class LiveTrackingService {
  constructor(private readonly gateway: LiveTrackingGateway) {}

  async saveAndBroadcast(data: TrackingData) {
    await db.insert(bus_live_tracking).values({
      bus_id: data.bus_id,
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed ?? 0,
      recorded_at: data.recorded_at,
    });
  }
  async getBusHistory(busId: string) {
    return await db
      .select()
      .from(bus_live_tracking)
      .where(eq(bus_live_tracking.bus_id, busId))
      .orderBy(bus_live_tracking.recorded_at);
  }
}
