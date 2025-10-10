import { Module } from '@nestjs/common';
import { WomanSafetyService } from './woman_safety.service';
import { WomanSafetyController } from './woman_safety.controller';

@Module({
  providers: [WomanSafetyService],
  controllers: [WomanSafetyController],
})
export class WomanSafetyModule {}
