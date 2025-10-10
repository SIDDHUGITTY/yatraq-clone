import { Module } from '@nestjs/common';
import { MedicalAssistancesService } from './medical_assistances.service';
import { MedicalAssistancesController } from './medical_assistances.controller';

@Module({
  providers: [MedicalAssistancesService],
  controllers: [MedicalAssistancesController],
})
export class MedicalAssistancesModule {}
