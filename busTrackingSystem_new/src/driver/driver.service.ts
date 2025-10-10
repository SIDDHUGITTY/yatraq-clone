import { Injectable } from '@nestjs/common';
import { and, eq,or } from 'drizzle-orm';
import { db } from 'src/db/db.connection';
import {
  bustable,
  ConductorAssignment,
  DEPOTtable,
  DriverAssignment,
  routetable,
  timmingtable,
  User,
} from 'src/db/schema';

@Injectable()
export class DriverService {
 async getDriverDetails(phone: string) {

  const driver = await db
    .select()
    .from(User)
    .where(
      and(
        eq(User.phone, phone),
        or(eq(User.role, 'DRIVER'), eq(User.role, 'CONDUCTOR'))
      )
    );

  if (driver.length === 0) {
    return { success: false, message: 'Driver/Conductor not found', driver: null };
  }

  const driverData = driver[0];

  // 2️⃣ Check if driver has a bus assignment
  const assignment = await db
    .select({
      bus_number: bustable.bus_number,
      bus_type: bustable.bus_type,
      capacity: bustable.capacity,
      status: bustable.status,
      depo_code_number: bustable.depo_code_number,
      depo_name: DEPOTtable.depo_name,
      depo_location: DEPOTtable.location,
      assigned_date: DriverAssignment.assigned_date,
      shift_time: DriverAssignment.shift_time,
       route_name: routetable.route_name,
      source_location: routetable.source_location_id,
      destination_location: routetable.destination_location_id,
      stops: routetable.stops,
    })
    .from(DriverAssignment)
    .leftJoin(bustable, eq(DriverAssignment.bus_id, bustable.bus_number))
    .leftJoin(
      DEPOTtable,
      eq(bustable.depo_code_number, DEPOTtable.depo_code_number),
    )
    .leftJoin(timmingtable, eq(bustable.bus_number, timmingtable.bus_id))
    .leftJoin(
      routetable,
      and(
        eq(timmingtable.source_location_id, routetable.source_location_id),
        eq(timmingtable.destination_location_id, routetable.destination_location_id)
      )
    )
    .where(eq(DriverAssignment.driver_phonenumber, driverData.phone));

  if (assignment.length === 0) {
    return {
      success: true,
      message: 'no bus assigned',
      driver: driverData,
      assignment: null,
    };
  }

  return {
    success: true,
    message: 'Your Details found and assignment is confirmed',
    driver: driverData,
    assignment: assignment[0],
  };
}

  async findbyphonenumber(phone: string) {
    const result = await db
      .select()
      .from(DriverAssignment)
      .where(eq(DriverAssignment.driver_phonenumber, phone));
    return result;
  }

  async getAllBusDetails() {
    const result = await db
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
      .orderBy(bustable.bus_number); // optional: order by bus number

    if (result.length === 0) {
      return { success: false, message: 'No bus assignments found', buses: [] };
    }

    return { success: true, message: 'All bus details fetched', buses: result };
  }

   async createmanager(){
   
     const result = await db.select().from(DEPOTtable).where(eq(User.role,'ADMIN'));
      return result
      
   }


    async AllDrivers(){
       const result = await db.select().from(User).where(eq(User.role,'DRIVER'));
         return result;
    }
    
     async AllCondutor(){
       const result = await db.select().from(User).where(eq(User.role,'CONDUCTOR'));
         return result;
    }
}
