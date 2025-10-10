import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { db } from 'src/db/db.connection';
import { routetable } from 'src/db/schema';

type Stop = {
  stop_name: string;
  status: 'ACTIVE' | 'INACTIVE';
  arrival_time: string;
  departure_time: string;
};
type UserRole = 'ADMIN' | 'MANAGER' | 'DRIVER' | 'CONDUCTOR' | 'PASSENGER';
@Injectable()
export class RouteService {
  async createRoute(
    userRole: UserRole,
    route_name: string,
    source_location_id: string,
    destination_location_id: string,
    longitude:number,
    latitude:number,
    stops: Stop[],
    distance_km: number,
    status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED',
    estimated_time_minutes: number,
  ) {
    try {
      // ✅ Role check
      if (userRole !== 'MANAGER') {
        throw new ForbiddenException('Only MANAGER can create routes');
      }

      // ✅ Insert into DB
      const result = await db
        .insert(routetable)
        .values({
          route_name,
          source_location_id,
          destination_location_id,
          stops, // stored as JSON in DB
          distance_km,
          status,
          estimated_time_minutes,
          longitude,
          latitude
        })
        .returning();

      return {
        message: 'Route created successfully',
        data: result[0],
      };
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(err.message);
    }
  }

  //   async getAllRoutes() {
  //     return await db.select().from(routetable);
  //   }

  //   async getRouteById(id: number) {
  //     const route = await db
  //       .select()
  //       .from(routetable)
  //       .where(routetable.route_id.eq(id));

  //     if (!route.length) {
  //       throw new BadRequestException('Route not found');
  //     }
  //     return route[0];
  //   }
}
