import {
  Controller,
  Get,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VisualizationchatService } from './visualizationchat.service';

interface AuthenticatedRequest extends Request {
  user?: {
    role: string;
    phone: string;
  };
}

@ApiTags('Visualization Chat')
@Controller('visualizationchat')
@UseGuards(AuthGuard('jwt'))
export class VisualizationchatController {
  constructor(
    private readonly visualizationService: VisualizationchatService,
  ) {}

  @Get('visualization')
  @ApiOperation({ summary: 'Get visualization data for dashboard' })
  async getVisualization(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    if (user.role !== 'MANAGER') {
      throw new ForbiddenException('Access denied. MANAGERS only.');
    }

    return this.visualizationService.Visualization();
  }
}
