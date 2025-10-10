import { ForbiddenException, Injectable } from '@nestjs/common';
import { db } from 'src/db/db.connection';
import { locationtable } from 'src/db/schema';

interface AuthenticatedRequest {
  user?: {
    role: string;
  };
}

@Injectable()
export class LocationtableService {
  async createlocationtable(
    location_name: string,
    city: string,
    state: string,
    pincode: string,
    req: AuthenticatedRequest,
  ): Promise<{ result: any }> {
    if (req.user?.role !== 'MANAGER') {
      throw new ForbiddenException(
        'Only ADMIN AND MANAGER can assign conductors',
      );
    }

    const result = await db
      .insert(locationtable)
      .values({ location_name, city, state, pincode })
      .returning();
    return {
      result,
    };
  }
  async Alllocation() {
    
    const result = await db.select().from(locationtable);
    return result;
  }
}
