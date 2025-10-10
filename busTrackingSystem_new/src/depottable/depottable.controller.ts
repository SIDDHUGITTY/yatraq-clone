import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DepottableService } from './depottable.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

interface AuthenticatedRequest {
  user?: {
    role: string;
  };
}
@ApiTags('Depot')
@Controller('depottable')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class DepottableController {
  constructor(private readonly service: DepottableService) {}
  @Get('AllDetails')
  async AllDetails() {
    const result = await this.service.AllDepoDetails();
    return {
      result,
    };
  }
  @Get('DepoDetailsByid/:id')
  @ApiOperation({
    summary: 'Get Depot Details by ID',
    description: 'Fetches depot details for a given depot ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'HYD-001',
    description: 'Depot ID to fetch details for',
  })
  async DepoDetailsById(@Param('id') id: string) {
    const result = await this.service.DepoDetailsById(id);
    return {
      result,
    };
  }
  @Post('create')
  @ApiOperation({
    summary: 'Create a new depot',
    description:
      'Creates a depot with code, name, location, and manager details.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        depo_code_number: { type: 'string', example: 'HYD-001' },
        depo_name: { type: 'string', example: 'Hyderabad Main Depot' },
        location: { type: 'string', example: 'Hyderabad' },
        manager_id: { type: 'string', example: 'MGR-1001' },
        contact_number: { type: 'string', example: '9876543210' },
      },
      required: [
        'depo_code_number',
        'depo_name',
        'location',
        'manager_id',
        'contact_number',
      ],
    },
  })
  async createDepo(
    @Req() req: AuthenticatedRequest,
    @Body()
    body: {
      depo_code_number: string;
      depo_name: string;
      location: string;
      manager_id: string;
      contact_number: string;
    },
  ) {
    const result = await this.service.createdepottable(
      body.depo_code_number,
      body.depo_name,
      body.location,
      body.contact_number,
      req,
    );
    return {
      result,
    };
  }
  @Patch('update/:id')
  @ApiOperation({
    summary: 'Update depot details',
    description:
      'Updates the depot name, location, and contact number for the given depot code number.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'HYD-001',
    description: 'Depot code number to update',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        depo_name: { type: 'string', example: 'New Hyderabad Depot' },
        location: { type: 'string', example: 'Hyderabad' },
        contact_number: { type: 'string', example: '9876543210' },
      },
      required: ['depo_name', 'location', 'contact_number'],
    },
  })
  async update(
    @Param('id') DepoCodeNumber: string,
    @Body()
    body: { depo_name: string; location: string; contact_number: string },
  ) {
    const result = await this.service.DepotUpdate(
      DepoCodeNumber,
      body.depo_name,
      body.location,
      body.contact_number,
    );
    return {
      result,
    };
  }
  @Delete('Delete/:id')
  @ApiOperation({
    summary: 'Delete depot by ID',
    description: 'Deletes the depot record for the given depot code number.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'HYD-001',
    description: 'Depot code number to delete',
  })
  async Delete(@Body() body: { id: string }) {
    const result = await this.service.DepotDelete(body.id);
    return {
      result,
    };
  }
}
