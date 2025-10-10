import { ForbiddenException, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from 'src/db/db.connection';
import { bustable, ConductorAssignment, DriverAssignment, feed_back, medicalAssistances, ReportBreakdown, womansafty } from 'src/db/schema';

@Injectable()
export class VisualizationchatService {
     async Visualization(){
      
        const totalBuses = await db
      .select({ count: sql<number>`count(*)` }).from(bustable)
        const totalwomansafty = await db
      .select({ count: sql<number>`count(*)` }).from(womansafty)
    const totalbreakdown = await db
      .select({ count: sql<number>`count(*)` }).from(ReportBreakdown)
       const totalfeedbreakdown = await db
      .select({ count: sql<number>`count(*)` }).from(feed_back)
  const medical_Assistances = await db
      .select({ count: sql<number>`count(*)` }).from(medicalAssistances)
   const totalDriverAssignment = await db
      .select({ count: sql<number>`count(*)` }).from(DriverAssignment)
  
  const  totalConductorAssignment = await db
      .select({ count: sql<number>`count(*)` }).from(ConductorAssignment)
  
 
    
   return {
        totalBusCount: totalBuses[0]?.count ?? 0,
       totalwomansafty: totalwomansafty[0]?.count ?? 0,
       totalbreakdown: totalbreakdown[0]?.count ?? 0,
         totalfeedbreakdown: totalfeedbreakdown[0]?.count ?? 0,
          medical_Assistances: medical_Assistances[0]?.count ?? 0,
          totalDriverAssignment:totalDriverAssignment[0]?.count?? 0,
          totalConductorAssignment:totalConductorAssignment[0]?.count?? 0,
    };
}
}
