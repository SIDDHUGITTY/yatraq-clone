import { ForbiddenException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/db/db.connection';
import { DEPOTtable } from 'src/db/schema';

export interface AuthenticatedRequest {
  user?: {
    role: string;
  };
}

@Injectable()
export class DepottableService {
  async createdepottable(
    depo_code_number: string,
    depo_name: string,
    location: string,
    manager_id: string,
    req: AuthenticatedRequest,
  ) {
    if (req.user?.role !== 'ADMIN') {
      console.log(req.user);
      throw new ForbiddenException('Access denied. Admins only.');
    }

    const result = await db
      .insert(DEPOTtable)
      .values({ depo_code_number, depo_name, location, manager_id })
      .returning();

    return {
      message: 'Depot created successfully',
      depot: result[0],
    };
  }

  async AllDepoDetails() {
    const result = await db.select().from(DEPOTtable);
    return { result };
  }

  async DepoDetailsById(id: string) {
    const result = await db
      .select()
      .from(DEPOTtable)
      .where(eq(DEPOTtable.depo_code_number, id));

    return { result };
  }

  async DepotUpdate(
    DepoCodeNumber: string,
    depo_name: string,
    location: string,
    manager_id: string,
  ) {
    const result = await db
      .update(DEPOTtable)
      .set({ depo_name, location, manager_id, Update_At: new Date() })
      .where(eq(DEPOTtable.depo_code_number, DepoCodeNumber))
      .returning();

    return { result };
  }

  async DepotDelete(
    id: string,
  ): Promise<{ message: string; deletedRows: number }> {
    const result = await db
      .delete(DEPOTtable)
      .where(eq(DEPOTtable.depo_code_number, id));

    return {
      message: 'Depot deleted successfully',
      deletedRows: result.rowCount ?? 0,
    };
  }
}
