import { Body, Controller, ForbiddenException, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LocationtableService } from './locationtable.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

interface AuthenticatedRequest {
  user?: {
    role: string;
  };
}
@ApiTags('Manager')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
@Controller('locationtable')
export class LocationtableController {
  constructor(private readonly service: LocationtableService) {}
  @Post('create')
  @ApiOperation({ summary: 'Create a new location' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        location_name: { type: 'string', example: 'Kukatpally' },
        city: { type: 'string', example: 'Hyderabad' },
        state: { type: 'string', example: 'Telangana' },
        pincode: { type: 'string', example: '500072' },
      },
      required: ['location_name', 'city', 'state', 'pincode'],
    },
  })
  async createlocation(
    @Req() req: AuthenticatedRequest,
    @Body()
    body: {
      location_name: string;
      city: string;
      state: string;
      pincode: string;
    },
  ) {
    const result = await this.service.createlocationtable(
      body.location_name,
      body.city,
      body.state,
      body.pincode,
      req,
    );
    return {
      result,
    };
  }
  @Get('alllocationtable')

  async alllocation(@Req() req: AuthenticatedRequest) {
     
     if (req.user?.role !== 'MANAGER') {
      throw new ForbiddenException(
        'Only ADMIN AND MANAGER can view location',
      );
    }
     console.log(req.user)
    const result = await this.service.Alllocation();
    return {
      result,
    };
  }
}
