import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DriverService } from './driver.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    role: string;
    phone: string;
  };
}

@ApiTags('Driver')
@ApiBearerAuth()
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Fetch driver by phone number (Driver/Conductor only)',
  })
  @Get('details')
  async getDriver(@Query('phone') phone: string) {
    return this.driverService.getDriverDetails(phone);
  }

  @Get('all-buses')
  @UseGuards(JwtAuthGuard)
  async getAllBuses(@Req() req: AuthenticatedRequest) {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'MANAGER') {
      throw new ForbiddenException(
        'Access denied. Only Admin or Manager allowed.',
      );
    }

    const result = await this.driverService.getAllBusDetails();
    return {
      message: result.message,
      buses: result.buses,
    };
  }

  @Get('AllDrivers')
  @UseGuards(JwtAuthGuard)
  async AllDrivers(@Req() req: AuthenticatedRequest) {
    if (req.user?.role !== 'MANAGER') {
      throw new ForbiddenException('Access denied. Manager only.');
    }

    const result = await this.driverService.AllDrivers();
    return result;
  }

  @Get('AllCondutor')
  @UseGuards(JwtAuthGuard)
  async Allcondutor(@Req() req: AuthenticatedRequest) {
    if (req.user?.role !== 'MANAGER') {
      throw new ForbiddenException('Access denied. Manager only.');
    }

    const result = await this.driverService.AllCondutor();
    return result;
  }

  @Get('create-driver')
  async getDriverDetails(@Query('phone') phone: string) {
    if (!phone) {
      throw new BadRequestException('Phone number is required');
    }

    const result = await this.driverService.getDriverDetails(phone);

    return result;
  }
}
