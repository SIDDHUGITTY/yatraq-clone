import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

type UserRole = 'ADMIN' | 'MANAGER' | 'DRIVER' | 'CONDUCTOR' | 'PASSENGER';

interface AuthenticatedRequest {
  user?: {
    role: UserRole;
  };
}
type Bustype =
  | 'ORDINARY'
  | 'EXPRESS'
  | 'DELUXE'
  | 'SUPER_LUXURY'
  | 'GARUDA'
  | 'METRO_EXPRESS';
type TransportMode =
  | 'CITY_BUS'
  | 'INTERCITY_BUS'
  | 'METRO'
  | 'LOCAL_TRAIN'
  | 'EXPRESS_BUS';
type BusStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE';

interface RequestUser {
  id: string;
  phone: string;
  role: UserRole;
}

interface RequestWithUser extends Request {
  user: RequestUser;
}

@ApiTags('Manager')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
@Controller('manager')
export class ManagerController {
  constructor(private readonly service: ManagerService) {}

  @Post('by-date')
  @ApiOperation({ summary: 'Get data by date range' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        start: { type: 'string', format: 'date', example: '2025-08-01' },
        end: { type: 'string', format: 'date', example: '2025-08-10' },
      },
      required: ['start', 'end'],
    },
  })
  async getByDateRange(
    @Req() req: RequestWithUser,
    @Body() body: { start: string; end: string },
  ): Promise<{ result: any }> {
    if (req.user?.role !== 'MANAGER') {
      throw new ForbiddenException('Access denied. Managers only.');
    }
    const result = await this.service.getByDateRange(
      new Date(body.start).toISOString(),
      new Date(body.end).toISOString(),
    );
    return { result };
  }

  @Post('createdriver')
  @ApiOperation({ summary: 'Create a new driver AND Conductor' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullname: { type: 'string', example: 'Ravi Kumar' },
        phone: { type: 'string', example: '9876543210' },
        Gender: { type: 'string', example: 'Male' },
        role: { type: 'string', example: 'DRIVER' },
      },
      required: ['fullname', 'phone', 'Gender', 'role'],
    },
  })
  async createDriver(
    @Req() req: RequestWithUser,
    @Body()
    body: { fullname: string; phone: string; Gender: string; role: UserRole },
  ) {
    const result = await this.service.createDriver(
      body.fullname,
      body.phone,
      body.Gender,
      body.role,
      req,
    );
   
    return result;
  }

  @Post('DriverAssignment')
  @ApiOperation({ summary: 'Assign a driver to a bus and route' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        driver_phonenumber: { type: 'string', example: '9876543210' },
        bus_id: { type: 'string', example: 'TS09Z1009' },
        route_id: { type: 'string', example: 'Shamshabad to Secunderabad' },
        assigned_date: { type: 'string', example: '11/08/2025' },
        shift_time: { type: 'string', example: '06:00:00' },
      },
      required: [
        'driver_phonenumber',
        'bus_id',
        'route_id',
        'assigned_date',
        'shift_time',
      ],
    },
  })
  async assignDriver(
    @Req() req: AuthenticatedRequest,
    @Body()
    body: {
      driver_phonenumber: string;
      bus_id: string;

      assigned_date: string;
      shift_time: string;
    },
  ): Promise<{ result: any }> {
    if (req.user?.role !== 'MANAGER') {
      console.log(req.user);
      throw new ForbiddenException('Access denied. Admins AND MANAGER  only.');
    }

    const result = await this.service.createdriverAssignment(
      body.driver_phonenumber,
      body.bus_id,

      new Date(body.assigned_date).toISOString(),
      body.shift_time,
      req,
    );
    return {
      result,
    };
  }

  @Post('conductorAssignment')
  @ApiOperation({ summary: 'Assign a conductor to a bus and route' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        conductor_phonenumber: { type: 'string', example: '9876543210' },
        bus_id: { type: 'string', example: 'BUS123' },
        route_id: { type: 'string', example: 'ROUTE456' },
        assigned_date: { type: 'string', example: '2025-08-08' },
        shift_time: { type: 'string', example: '09:00-13:00' },
      },
      required: [
        'conductor_phonenumber',
        'bus_id',
        'route_id',
        'assigned_date',
        'shift_time',
      ],
    },
  })
  async assignConductor(
    @Req() req: RequestWithUser,
    @Body()
    body: {
      conductor_phonenumber: string;
      bus_id: string;

      assigned_date: string;
      shift_time: string;
    },
  ): Promise<{ result: any }> {
    console.log(req.user);

    if (req.user?.role !== 'MANAGER') {
      console.log(req.user);
      throw new ForbiddenException('Access denied. Admins AND MANAGER  only.');
    }

    const result = await this.service.createconductorAssignment(
      body.conductor_phonenumber,
      body.bus_id,

      body.assigned_date,
      body.shift_time,
      req,
    );
    console.log(req.user);

    return { result };
  }

  @Post('createBus')
  @ApiOperation({ summary: 'Manager creates a bus ' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bus_number: { type: 'string', example: 'TS09AB1234' },
        bus_type: {
          type: 'string',
          enum: [
            'ORDINARY',
            'EXPRESS',
            'DELUXE',
            'SUPER_LUXURY',
            'GARUDA',
            'METRO_EXPRESS',
          ],
          example: 'EXPRESS',
        },
        transport_mode: {
          type: 'string',
          enum: [
            'CITY_BUS',
            'INTERCITY_BUS',
            'METRO',
            'LOCAL_TRAIN',
            'EXPRESS_BUS',
          ],
          example: 'CITY_BUS',
        },
        status: {
          type: 'string',
          enum: ['ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE'],
          example: 'ACTIVE',
        },
      },
      required: ['bus_number', 'bus_type', 'transport_mode'],
    },
  })
  async createBus(
    @Req() req: RequestWithUser,
    @Body()
    body: {
      bus_number: string;
      bus_type: Bustype;
      transport_mode: TransportMode;
      status?: BusStatus;
    },
  ): Promise<{ result: any }> {
    if (req.user?.role !== 'MANAGER') {
      throw new ForbiddenException('Access denied. Managers only.');
    }

    const result = await this.service.createBus(
      req.user.phone,
      body.bus_number,
      body.bus_type,
      body.transport_mode,
      req,
      body.status ?? 'ACTIVE',
    );

    return { result };
  }

  @Get('AllBusNumber')
  async AllBusNumber(
    @Req() req: AuthenticatedRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.service.AllBusNumber(+page, +limit, req);
    return {
      result,
    };
  }
 
  @Get('Allmanager')
  async getAllManagers(@Req() req: AuthenticatedRequest){
    if (req.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied. Admins only.');
    }
    const result = await this.service.getAllManagersWithDepots();
    return { result };
  }
 @Delete('Deletebus')
  async deleteBus(@Query('busnumber') busnumber: string,@Req() req:AuthenticatedRequest) {
     if (req.user?.role !== 'MANAGER') {
      console.log(req.user);
      throw new ForbiddenException('Access denied. Admins AND MANAGER  only.');
    }
    if (!busnumber) {
      throw new BadRequestException('busnumber is required');
    }
   
    const result = await this.service.deletebus(busnumber);
if (!result) {
    throw new BadRequestException(`Bus with number ${busnumber} not found`);
  }

    return {
      success: true,
      message: `Bus ${busnumber} deleted successfully`,
      result,
      
    };
  }
}
