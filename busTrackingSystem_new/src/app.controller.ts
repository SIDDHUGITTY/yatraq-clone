import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { testDatabaseConnection } from './db/db.connection';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth() {
    const dbStatus = await testDatabaseConnection();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'connected' : 'disconnected',
      uptime: process.uptime(),
    };
  }
}
