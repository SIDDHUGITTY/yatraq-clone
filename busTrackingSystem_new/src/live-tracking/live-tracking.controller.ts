import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LiveTrackingService } from './live-tracking.service';
import { TrackingData, TrackingDataInput } from './dto/tracking-data.dto';

@Controller('live-tracking')
export class LiveTrackingController {
  constructor(private readonly trackingService: LiveTrackingService) {}

  @Post('trackingData')
  async receiveLocation(@Body() data: TrackingDataInput) {
    const trackingData: TrackingData = {
      ...data,
      speed: data.speed ?? 0,
      recorded_at: new Date(),
    };

    await this.trackingService.saveAndBroadcast(trackingData);

    return {
      trackingData,
      status: 'Location updated',
    };
  }
  @Get(':busId')
  async getBusHistory(@Param('busId') busId: string) {
    return this.trackingService.getBusHistory(busId);
  }
}
