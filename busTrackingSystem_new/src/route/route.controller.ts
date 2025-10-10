import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RouteService } from './route.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

type Stop = {
  stop_name: string;
  status: 'ACTIVE' | 'INACTIVE';
  arrival_time: string;
  departure_time: string;
  longitude: number;
  latitude: number;
};

interface AuthenticatedRequest extends Request {
  user?: {
    role: 'ADMIN' | 'MANAGER' | 'DRIVER' | 'CONDUCTOR' | 'PASSENGER';
  };
}

@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new route (Only MANAGER)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        route_name: { type: 'string', example: 'Miyapur to Airport' },
        source_location_id: { type: 'string', example: 'Miyapur' },
        destination_location_id: { type: 'string', example: 'Shamshabad' },
        longitude: { type: 'number', example: 78.389 },
        latitude: { type: 'number', example: 17.493 },
        stops: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              stop_name: { type: 'string', example: 'Kondapur' },
              status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
              arrival_time: { type: 'string', example: '05:50' },
              departure_time: { type: 'string', example: '05:52' },
              longitude: { type: 'number', example: 78.35 },
              latitude: { type: 'number', example: 17.48 },
            },
          },
        },
        distance_km: { type: 'number', example: 45 },
        status: {
          type: 'string',
          enum: ['ACTIVE', 'INACTIVE', 'CANCELLED'],
          example: 'ACTIVE',
        },
        estimated_time_minutes: { type: 'number', example: 90 },
      },
    },
  })
  async createRoute(
    @Body()
    body: {
      route_name: string;
      source_location_id: string;
      destination_location_id: string;
      longitude: number;
      latitude: number;
      stops: Stop[];
      distance_km: number;
      status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
      estimated_time_minutes: number;
    },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.routeService.createRoute(
      req.user?.role || 'PASSENGER',
      body.route_name,
      body.source_location_id,
      body.destination_location_id,
      body.longitude,
      body.latitude,
      body.stops,
      body.distance_km,
      body.status,
      body.estimated_time_minutes,
    );
  }
}
