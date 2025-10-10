import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  name: string;
  email: string;
  dateOfBirth: string;
  profile: string;
  gender: string;
  role: string;
  phone: string;
  driver_code?: string;
  conductor_code?: string;
  shift_time?: string;
  bus_id?: string;
  route_id?: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret',
    });
  }

  validate(payload: JwtPayload) {
    return {
      name: payload.name,
      email: payload.email,
      dateOfBirth: payload.dateOfBirth,
      profile: payload.profile,
      gender: payload.gender,
      role: payload.role,
      phone: payload.phone,
      driver_code: payload.driver_code,
      conductor_code: payload.conductor_code,
      shift_time: payload.shift_time,
      bus_id: payload.bus_id,
      route_id: payload.route_id,
    };
  }
}
