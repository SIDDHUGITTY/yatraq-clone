import { ForbiddenException, Injectable } from '@nestjs/common';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { db } from 'src/db/db.connection';

interface AuthenticatedRequest {
  user?: {
    role: string;
    depot_id?: string;
  };
}
import {
  bustable,
  ConductorAssignment,
  DEPOTtable,
  DriverAssignment,
  routetable,
  timmingtable,
  User,
} from 'src/db/schema';
type UserRole = 'ADMIN' | 'MANAGER' | 'DRIVER' | 'CONDUCTOR' | 'PASSENGER';
type Bustype =
  | 'ORDINARY'
  | 'EXPRESS'
  | 'DELUXE'
  | 'SUPER_LUXURY'
  | 'GARUDA'
  | 'METRO_EXPRESS';
type TransportMode =
  | 'CITY_BUS'
  | 'INTERCITY_BUS'
  | 'METRO'
  | 'LOCAL_TRAIN'
  | 'EXPRESS_BUS';
type BusStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE';

@Injectable()
export class ManagerService {
  async getByDateRange(start: string, end: string) {
    function parseDate(ddmmyyyy: string): Date {
      const [day, mount, year] = ddmmyyyy.split('/');
      if (!day || !mount || !year) {
        throw new Error('Invalidate date format. use dd/mm/yyyy.');
      }
      return new Date(`${year}-${mount}-${day}`);
    }
    const startdate = parseDate(start);
    const enddate = parseDate(end);
    console.log('start', startdate.toISOString());
    console.log('end', enddate.toISOString());

    const result = await db
      .select({
        bus_number: bustable.bus_number,
        bus_type: bustable.bus_type,
        capacity: bustable.capacity,
        depo_id: bustable.depo_code_number,

        departure_time: timmingtable.departure_time,
        stops: routetable.stops,
        status: routetable.status,
        arrival_time: timmingtable.arrival_time,
        source_location_id: timmingtable.source_location_id,
        destination_location_id: timmingtable.destination_location_id,
        trip_date: timmingtable.trip_date,
      })
      .from(bustable)
      .where(
        and(
          gte(bustable.Create_At, startdate),
          lte(bustable.Create_At, enddate),
        ),
      )
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
      );

    return {
      result,
    };
  }
  async createDriver(
    fullname: string,
    phone: string,
    Gender: string,
    role: UserRole,
    req: AuthenticatedRequest,
  ) {
    if (req.user?.role !== 'MANAGER') {
      throw new ForbiddenException(
        'Only ADMIN AND MANAGER can assign conductors',
      );
    }
    const existingUser = await db
    .select()
    .from(User)
    .where(eq(User.phone, phone));

  if (existingUser.length > 0) {
    return {
      success: false,
      message: `User with phone ${phone} already exists`,
    };
  }
    const result = await db
      .insert(User)
      .values({ fullname, phone, Gender, role })
      .returning();
    return result;
  }
  async createdriverAssignment(
    driver_phonenumber: string,
    bus_id: string,

    assigned_date: string,
    shift_time: string,
    req: AuthenticatedRequest,
  ) {
    if (req.user?.role !== 'MANAGER') {
      throw new ForbiddenException(
        'Only ADMIN AND MANAGER can assign conductors',
      );
    }
    const [inserted] = await db
      .insert(DriverAssignment)
      .values({
        driver_phonenumber,
        bus_id,

        assigned_date,
        shift_time,
        driver_code: 'TEMP',
      })
      .returning({ id: DriverAssignment.id });

    const driver_code = `DRV${String(inserted.id).padStart(4, '0')}`;

    const [updated] = await db
      .update(DriverAssignment)
      .set({ driver_code })
      .where(eq(DriverAssignment.id, inserted.id))
      .returning();

    return updated;
  }

  async getAllManagersWithDepots() {
    const result = await db
      .select({
        fullname: User.fullname,
        phone: User.phone,
        email: User.email,
        role: User.role,
        depot_code: DEPOTtable.depo_code_number,
        depot_name: DEPOTtable.depo_name,
        depot_location: DEPOTtable.location,
      })
      .from(User)
      .leftJoin(DEPOTtable, eq(DEPOTtable.manager_id, User.phone));
      

    return result;
  }

  async createconductorAssignment(
    conductor_phonenumber: string,
    bus_id: string,

    assigned_date: string,
    shift_time: string,
    req: AuthenticatedRequest,
  ) {
    if (req.user?.role !== 'MANAGER') {
      throw new ForbiddenException(
        'Only ADMIN AND MANAGER can assign conductors',
      );
    }

    // Validate inputs to avoid inserting defaults/nulls
    if (!conductor_phonenumber) {
      throw new ForbiddenException('conductor_phonenumber is required');
    }
    if (!bus_id) {
      throw new ForbiddenException('bus_id is required');
    }
    if (!assigned_date) {
      throw new ForbiddenException('assigned_date is required');
    }
    if (!shift_time) {
      throw new ForbiddenException('shift_time is required');
    }

    // Normalize types
    const assignedDateValue = new Date(assigned_date);
    if (isNaN(assignedDateValue.getTime())) {
      throw new ForbiddenException('assigned_date must be YYYY-MM-DD');
    }

    const [inserted] = await db
      .insert(ConductorAssignment)
      .values({
        conductor_phonenumber: conductor_phonenumber,
        bus_id: bus_id,
        assigned_date: assignedDateValue as unknown as any,
        shift_time: shift_time as unknown as any,
        condutor_code: 'TEMP',
      })
      .returning({ id: ConductorAssignment.id });

    const condutor_code = `CON${String(inserted.id).padStart(4, '0')}`;

    const [updated] = await db
      .update(ConductorAssignment)
      .set({ condutor_code })
      .where(eq(ConductorAssignment.id, inserted.id))
      .returning();

    return updated;
  }

  async createBus(
    managerPhone: string,
    bus_number: string,
    bus_type: Bustype,
    transport_mode: TransportMode,
    req: AuthenticatedRequest,
    status: BusStatus = 'ACTIVE',
  ) {
    if (req.user?.role !== 'MANAGER') {
      throw new ForbiddenException('Access denied. Managers only.');
    }

    const [managerDepot] = await db
      .select()
      .from(DEPOTtable)
      .where(eq(DEPOTtable.manager_id, managerPhone));

    if (!managerDepot) {
      throw new ForbiddenException('No depot found for this manager.');
    }

    function getCapacityByBusType(type: Bustype): number {
      switch (type) {
        case 'ORDINARY':
          return 60;
        case 'EXPRESS':
          return 50;
        case 'DELUXE':
          return 45;
        case 'SUPER_LUXURY':
          return 40;
        case 'GARUDA':
          return 30;
        case 'METRO_EXPRESS':
          return 55;
        default:
          return 60;
      }
    }

    const capacity = getCapacityByBusType(bus_type);

    const [newBus] = await db
      .insert(bustable)
      .values({
        bus_number,
        bus_type,
        transport_mode,
        status,
        capacity,
        depo_code_number: managerDepot.depo_code_number,
      })
      .returning();

    return {
      message: 'Bus created successfully',
      bus: newBus,
    };
  }

  async AllBusNumber(page: number, limit: number, req: AuthenticatedRequest) {
    if (req.user?.role !== 'MANAGER') {
      throw new ForbiddenException('Access denied. Managers only.');
    }
    const managerDepotId = req.user.depot_id;
    if (!managerDepotId) {
      throw new ForbiddenException('Manager depot not found.');
    }
    const currentPage = Math.max(1, page);
    const pageSize = Math.max(1, limit);
    const offset = (currentPage - 1) * pageSize;
    const totalRecordsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(timmingtable);
    const totalRecords = totalRecordsResult[0].count;

    const result = await db
      .select({ BusNumber: bustable.bus_number })
      .from(bustable)
      .limit(pageSize)
      .offset(offset);
    return {
      data: result,
      meta: {
        totalRecords,
        currentPage,
        pageSize,
        totalPages: Math.ceil(totalRecords / pageSize),
      },
    };
  }
   
async deletebus(busnumber: string) {
    const result = await db
      .delete(bustable)
      .where(eq(bustable.bus_number, busnumber));
 if (result.rowCount === 0) {
    return null; 
  }
    return result;
  }
//   async deleteconductor(busnumber: string) {
//     const result = await db
//       .delete(bustable)
//       .where(eq(bustable.bus_number, busnumber));
//  if (result.rowCount === 0) {
//     return null; 
//   }
//     return result;
//   }
}
