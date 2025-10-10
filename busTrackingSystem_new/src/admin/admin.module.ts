import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { LoginController } from 'src/login/login.controller';
import { LoginService } from 'src/login/login.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [AdminService, LoginService],
  controllers: [AdminController, LoginController],
})
export class AdminModule {}
