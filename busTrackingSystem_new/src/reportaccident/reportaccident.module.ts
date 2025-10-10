import { Module } from '@nestjs/common';
import { ReportaccidentService } from './reportaccident.service';
import { ReportaccidentController } from './reportaccident.controller';

@Module({
  providers: [ReportaccidentService],
  controllers: [ReportaccidentController],
})
export class ReportaccidentModule {}
