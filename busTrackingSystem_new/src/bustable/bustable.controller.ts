import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BustableService } from './bustable.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('bustable')
@Controller('bustable')
export class BustableController {
  constructor(private readonly service: BustableService) {}
  @Post('Busnumber')
  @ApiOperation({
    summary: 'Get bus details by bus number',
    description: 'Fetches details for a bus using its bus number.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        busnumber: { type: 'string', example: 'TS09AB1234' },
      },
      required: ['busnumber'],
    },
  })
  async GetByBus(@Body() body: { busnumber: string }) {
    const result = await this.service.GetByBusNumber(body.busnumber);

    return result;
  }

  @Get('all')
  async getAllBuses(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    return this.service.getAllBuses(pageNumber, limitNumber);
  }
}
