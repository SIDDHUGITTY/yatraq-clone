import { Module } from '@nestjs/common';
import { VisualizationchatService } from './visualizationchat.service';
import { VisualizationchatController } from './visualizationchat.controller';

@Module({
  providers: [VisualizationchatService],
  controllers: [VisualizationchatController],
})
export class VisualizationchatModule {}
