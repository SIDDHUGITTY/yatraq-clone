import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConductorService } from 'src/conductor/conductor.service';

import { DriverService } from 'src/driver/driver.service';
import { LoginService } from 'src/login/login.service';
export type UserRole =
  | 'ADMIN'
  | 'MANAGER'
  | 'DRIVER'
  | 'CONDUCTOR'
  | 'PASSENGER';
export interface BasePayload {
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  role: UserRole;
  profile: string; // always a string in JWT
  phone: string;
}
export interface DriverAssignment {
  driver_code: string;
  shift_time: string;
  bus_id: string;
  route_id: string;
}
export interface ConductorAssignment {
  conductor_code: string;
  shift_time: string;
  bus_id: string;
  route_id: string;
}
export type Assignment = Partial<DriverAssignment & ConductorAssignment>;
export type AuthPayload = BasePayload & Assignment;

interface UserFromDB {
  fullname: string;
  email: string;
  DateofBirth: string;
  Gender: string;
  role: UserRole;
  profile_url: string;
  phone: string;
}

@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    private readonly userservice: LoginService,
    private readonly jwtService: JwtService,
    private readonly driverservice: DriverService,
    private readonly conductorservice: ConductorService,
  ) {}

  async authenticate(phone: string) {
    try {
      const user = (await this.userservice.getbyphone(phone)) as UserFromDB;
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      let assignment: Assignment | null = null;

      if (user.role === 'DRIVER') {
        const result = await this.driverservice.findbyphonenumber(user.phone);
        if (result && result.length > 0) {
          assignment = {
            driver_code: result[0].driver_code,
            shift_time: result[0].shift_time,
            bus_id: result[0].bus_id,
          };
        }
      } else if (user.role === 'CONDUCTOR') {
        const result = await this.conductorservice.findbyphonenumber(
          user.phone,
        );
        if (result && result.length > 0) {
          assignment = {
            conductor_code: result[0].condutor_code,
            shift_time: result[0].shift_time,
            bus_id: result[0].bus_id,
          };
        }
      }

      const payload: AuthPayload = {
        name: user.fullname,
        email: user.email,
        dateOfBirth: user.DateofBirth,
        gender: user.Gender,
        role: user.role,
        profile: user.profile_url,
        phone: user.phone,

        ...(assignment || {}),
      };

      const token = this.jwtService.sign(payload);

      return {
        access_token: token,
        user: payload,
      };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new UnauthorizedException(error.message || 'Authentication failed');
    }
  }

  logout(): Promise<{ message: string }> {
    // In a real implementation, you would add the token to a blacklist
    // For now, we'll just return a success message
    return Promise.resolve({ message: '✅ Logged out successfully' });
  }
}
