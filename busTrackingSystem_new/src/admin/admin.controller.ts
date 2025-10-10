import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';

interface AuthenticatedRequest {
  user?: {
    role: string;
  };
}

type UserRole = 'ADMIN' | 'MANAGER' | 'DRIVER' | 'CONDUCTOR' | 'PASSENGER';
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

interface JwtUser {
  id: string;
  role: UserRole;
  email?: string;
  phone?: string;
}
export interface AuthRequest extends Request {
  user: JwtUser;
}

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class AdminController {
  constructor(private readonly service: AdminService) {}
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
    @Body() body: { start: string; end: string },
  ): Promise<any> {
    const result = await this.service.getByDateRange(body.start, body.end);
    return { result };
  }

  @Post('createmanager')
  @ApiOperation({ summary: 'Create a new manager' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullname: { type: 'string', example: 'Ravi Kumar' },
        phone: { type: 'string', example: '9876543210' },
        Gender: { type: 'string', example: 'Male' },
        role: { type: 'string', example: 'MANAGER' },
      },
      required: ['fullname', 'phone', 'Gender', 'role'],
    },
  })
  async createManager(
    @Req() req: AuthRequest,
    @Body()
    body: { fullname: string; phone: string; Gender: string; role: UserRole },
  ): Promise<any> {
    if (req.user?.role !== 'ADMIN') {
      console.log(req.user);
      throw new ForbiddenException('Access denied. Admins only.');
    }
    const result = await this.service.createManager(
      body.fullname,
      body.phone,
      body.Gender,
      body.role,
      req,
    );
    return result;
  }
  @Post('createBus')
  @ApiOperation({ summary: 'Create a new NewBus' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bus_number: { type: 'string', example: 'TS08AB4567' },
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
        },
        depo_code_number: { type: 'string', example: 'HYD-2' },
      },
      required: [
        'bus_number',
        'bus_type',
        'transport_mode',
        'depo_code_number',
      ],
    },
  })
  async createBus(
    @Req() req: AuthenticatedRequest,
    @Body()
    body: {
      bus_number: string;
      bus_type: Bustype;
      transport_mode: TransportMode;
      depo_code_number: string;
    },
  ) {
    const result = await this.service.createbustable(
      body.bus_number,
      body.bus_type,
      body.transport_mode,
      body.depo_code_number,
      req,
    );
    return {
      result,
    };
  }

  // @Post('register-manager')
  // @UseInterceptors(FileInterceptor('profile_url'))
  // async createManagerWithOtp(
  //   @UploadedFile() profile_url: Express.Multer.File,
  //   @Body()
  //   body: {
  //     fullname: string;
  //     phone: string;
  //     email: string;
  //     DateofBirth: string;
  //     Gender: string;
  //   },
  // ) {
  //   const result = await this.service.createmanger(
  //     body.fullname,
  //     body.phone,
  //     profile_url,
  //     body.email,
  //     body.DateofBirth,
  //     body.Gender,
  //   );
  //   return result;
  // }
  // @Post('verify-otp')
  // async verifyOtp(@Body() body: { email: string; otp: string }) {
  //   return this.service.verifyOtp(body.email, body.otp);
  // }
}
