import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';

import { DepottableModule } from './depottable/depottable.module';
import { LoginModule } from './login/login.module';
import { AuthModule } from './auth/auth.module';
import { BustableModule } from './bustable/bustable.module';
import { LocationtableModule } from './locationtable/locationtable.module';
import { TimingModule } from './timing/timing.module';
import { RouteModule } from './route/route.module';

import { DriverModule } from './driver/driver.module';
import { ConductorModule } from './conductor/conductor.module';

import { ManagerModule } from './manager/manager.module';
import { AdminModule } from './admin/admin.module';
import { WomanSafetyModule } from './woman_safety/woman_safety.module';
import { ReportBreakdownModule } from './report-breakdown/report-breakdown.module';
import { MedicalAssistancesModule } from './medical_assistances/medical_assistances.module';
import { ReportaccidentModule } from './reportaccident/reportaccident.module';
import { FeedBackModule } from './feed_back/feed_back.module';
import { LiveTrackingModule } from './live-tracking/live-tracking.module';

import { VisualizationchatModule } from './visualizationchat/visualizationchat.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    EmailModule,
    ProfileModule,
    LoginModule,
    DepottableModule,
    AuthModule,
    BustableModule,
    LocationtableModule,
    TimingModule,
    RouteModule,
    DriverModule,
    ConductorModule,
    LiveTrackingModule,
    ManagerModule,
    AdminModule,
    AuthModule,
    WomanSafetyModule,
    ReportBreakdownModule,
    MedicalAssistancesModule,
    ReportaccidentModule,
    FeedBackModule,
    VisualizationchatModule,
    ServeStaticModule.forRoot({
      // Use process.cwd() so in production it resolves to /app/uploads, not /app/dist/uploads
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false, // avoid looking for /uploads/index.html
        redirect: false,
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
