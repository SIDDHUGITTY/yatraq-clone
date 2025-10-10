import { Module } from '@nestjs/common';
import { ReportBreakdownService } from './report-breakdown.service';
import { ReportBreakdownController } from './report-breakdown.controller';

@Module({
  providers: [ReportBreakdownService],
  controllers: [ReportBreakdownController],
})
export class ReportBreakdownModule {}
