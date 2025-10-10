import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { LoginService } from 'src/login/login.service';
import { LoginController } from 'src/login/login.controller';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [ProfileService, LoginService],
  controllers: [ProfileController, LoginController],
})
export class ProfileModule {}
