import { BadRequestException, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/db/db.connection';
import { sql } from 'drizzle-orm';
import {
  bustable,
  ConductorAssignment,
  DEPOTtable,
  DriverAssignment,
  routetable,
  timmingtable,
} from 'src/db/schema';

@Injectable()
export class BustableService {
  async GetByBusNumber(bus_number: string) {
    const result = await db
      .select({
        bus_number: bustable.bus_number,
        bus_type: bustable.bus_type,
        capacity: bustable.capacity,
        drivercode: DriverAssignment.driver_code,
        driver_phonenumber: DriverAssignment.driver_phonenumber,
        conductor_code: ConductorAssignment.condutor_code,
        conductor_phonenumber: ConductorAssignment.conductor_phonenumber,
        depo_id: bustable.depo_code_number,
        demo_contact_number: DEPOTtable.manager_id,
        departure_time: timmingtable.departure_time,
        arrival_time: timmingtable.arrival_time,
        source_location_id: timmingtable.source_location_id,
        destination_location_id: timmingtable.destination_location_id,
        trip_date: timmingtable.trip_date,
        stops: routetable.stops,
        longitude: routetable.longitude,
        latitude: routetable.latitude,
        status: routetable.status,
      })

      .from(bustable)
      .where(eq(bustable.bus_number, bus_number))
      .innerJoin(timmingtable, eq(timmingtable.bus_id, bustable.bus_number))
      .innerJoin(
        routetable,
        and(
          eq(routetable.source_location_id, timmingtable.source_location_id),
          eq(
            routetable.destination_location_id,
            timmingtable.destination_location_id,
          ),
        ),
      )
      .innerJoin(
        DEPOTtable,
        eq(DEPOTtable.depo_code_number, bustable.depo_code_number),
      )
      .innerJoin(
        DriverAssignment,
        eq(DriverAssignment.bus_id, bustable.bus_number),
      )
      .innerJoin(
        ConductorAssignment,
        eq(ConductorAssignment.bus_id, bustable.bus_number),
      );

    if (result.length === 0) {
      throw new BadRequestException('Invalid Bus Number, try again');
    }

    return result;
  }

  async getAllBuses(page: number, limit: number) {
    const offset = (page - 1) * limit;

    // ✅ Join bustable + depot + route
    const buses = await db
      .select({
        bus_number: bustable.bus_number,
        bus_type: bustable.bus_type,
        capacity: bustable.capacity,

        driver_code: DriverAssignment.driver_code,
        driver_phonenumber: DriverAssignment.driver_phonenumber,

        conductor_code: ConductorAssignment.condutor_code,
        conductor_phonenumber: ConductorAssignment.conductor_phonenumber,

        depo_id: bustable.depo_code_number,
        manager_contact_number: DEPOTtable.manager_id,

        departure_time: timmingtable.departure_time,
        arrival_time: timmingtable.arrival_time,
        source_location_id: timmingtable.source_location_id,
        destination_location_id: timmingtable.destination_location_id,
        trip_date: timmingtable.trip_date,
        latitude: routetable.latitude,
        stops: routetable.stops,
        status: routetable.status,
      })
      .from(bustable)
      .innerJoin(timmingtable, eq(timmingtable.bus_id, bustable.bus_number))
      .innerJoin(
        routetable,
        and(
          eq(routetable.source_location_id, timmingtable.source_location_id),
          eq(
            routetable.destination_location_id,
            timmingtable.destination_location_id,
          ),
        ),
      )
      .innerJoin(
        DEPOTtable,
        eq(DEPOTtable.depo_code_number, bustable.depo_code_number),
      )
      .innerJoin(
        DriverAssignment,
        eq(DriverAssignment.bus_id, bustable.bus_number),
      )
      .innerJoin(
        ConductorAssignment,
        eq(ConductorAssignment.bus_id, bustable.bus_number),
      )
      .limit(limit)
      .offset(offset);

    // ✅ Count total buses
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bustable);

    const totalCount = totalCountResult[0]?.count ?? 0;

    return {
      success: true,
      message: 'Buses fetched successfully',
      // page,
      // limit,
      totalCount,
      // totalPages: Math.ceil(totalCount / limit),
      buses,
    };
  }
}
