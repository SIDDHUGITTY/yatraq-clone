import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { db } from 'src/db/db.connection';
import { and, eq, gte, lte } from 'drizzle-orm';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { bustable, routetable, timmingtable, User } from 'src/db/schema';
import { config } from 'dotenv';
import { LoginService } from 'src/login/login.service';

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
config();
interface OtpStorage {
  [email: string]: {
    secret: string;
    expiresAt: number;
    userData: {
      fullname: string;
      phone: string;
      profile_url: string;
      DateofBirth: string;
      Gender: string;
    };
  };
}

@Injectable()
export class AdminService {
  private readonly uploadPath =
    process.env.UPLOAD_PATH ||
    path.join(process.cwd(), 'uploads', 'CommentImages');
  private otpStore: OtpStorage = {};
  // Email functionality moved to EmailService
  constructor(private readonly service: LoginService) {
    try {
      if (!fs.existsSync(this.uploadPath)) {
        fs.mkdirSync(this.uploadPath, { recursive: true });
        console.log('Image upload folder created:', this.uploadPath);
      }
    } catch (error) {
      console.error('Failed to create upload directory:', error);
      console.log('Using fallback upload path:', this.uploadPath);
    }
  }

  async getByDateRange(start: string, end: string) {
    function parseDate(ddmmyyyy: string): Date {
      const [day, mount, year] = ddmmyyyy.split('/');
      if (!day || !mount || !year) {
        throw new Error('Invalidate date format. use dd/mm/yyyy.');
      }
      return new Date(`${year}-${mount}-${day}`);
    }
    const startdate = parseDate(start);
    const enddate = parseDate(end);
    console.log('start', startdate.toISOString());
    console.log('end', enddate.toISOString());

    const result = await db
      .select({
        bus_number: bustable.bus_number,
        bus_type: bustable.bus_type,
        capacity: bustable.capacity,
        depo_id: bustable.depo_code_number,

        departure_time: timmingtable.departure_time,
        stops: routetable.stops,
        status: routetable.status,
        arrival_time: timmingtable.arrival_time,
        source_location_id: timmingtable.source_location_id,
        destination_location_id: timmingtable.destination_location_id,
        trip_date: timmingtable.trip_date,
      })
      .from(bustable)
      .where(
        and(
          gte(bustable.Create_At, startdate),
          lte(bustable.Create_At, enddate),
        ),
      )
      .innerJoin(timmingtable, eq(timmingtable.bus_id, bustable.bus_number))
      .innerJoin(
        routetable,
        and(
          eq(routetable.source_location_id, timmingtable.source_location_id),
          eq(
            routetable.destination_location_id,
            timmingtable.destination_location_id,
          ),
        ),
      );

    return {
      result,
    };
  }

  async createManager(
    fullname: string,
    phone: string,
    Gender: string,
    role: UserRole,
    req: AuthenticatedRequest,
  ) {
    if (req.user?.role !== 'ADMIN') {
      console.log(req.user);
      throw new ForbiddenException('Access denied. Admins only.');
    }
    const existingUser = await db
      .select()
      .from(User)
      .where(eq(User.phone, phone));

    if (existingUser.length > 0) {
      throw new ConflictException('Phone number already exists');
    }

    const result = await db
      .insert(User)
      .values({ fullname, phone, Gender, role })
      .returning();
    return result;
  }

  async createbustable(
    bus_number: string,
    bus_type: Bustype,
    transport_mode: TransportMode,
    depo_code_number: string,
    req: AuthenticatedRequest,
  ): Promise<{ message: string; bus: any }> {
    if (req.user?.role !== 'ADMIN') {
      console.log(req.user);
      throw new ForbiddenException('Access denied. Admins only.');
    }

    function getCapacityByBusType(type: string): number {
      switch (type) {
        case 'ORDINARY':
          return 60;
        case 'EXPRESS':
          return 50;
        case 'DELUXE':
          return 45;
        case 'SUPER_LUXURY':
          return 40;
        case 'GARUDA':
          return 30;
        case 'METRO_EXPRESS':
          return 55;
        default:
          return 60;
      }
    }

    const finalCapacity: number = getCapacityByBusType(bus_type);
    const result = await db
      .insert(bustable)
      .values({
        bus_number,
        bus_type,
        transport_mode,
        capacity: finalCapacity,
        depo_code_number,
      })
      .returning();
    return {
      message: 'Bus added successfully',
      bus: result[0],
    };
  }
  private formatDate(dob: string): string {
    if (/^\d{8}$/.test(dob)) {
      const day = dob.substring(0, 2);
      const month = dob.substring(2, 4);
      const year = dob.substring(4);
      return `${year}-${month}-${day}`;
    }
    return dob; // already in valid format
  }

  // async createmanger(
  //   fullname: string,
  //   phone: string,
  //   profile_url: Express.Multer.File,
  //   email: string,
  //   DateofBirth: string,
  //   Gender: string,
  // ) {
  //   if (!profile_url || !profile_url.originalname || !profile_url.buffer) {
  //     throw new BadRequestException('Profile image is required');
  //   }

  //   const filename = `${Date.now()}-${profile_url.originalname}`;
  //   const filepath = path.join(this.uploadPath, filename);
  //   fs.writeFileSync(filepath, profile_url.buffer);

  //   const existingEmail = await db
  //     .select()
  //     .from(User)
  //     .where(eq(User.email, email));

  //   if (existingEmail.length > 0) {
  //     throw new BadRequestException('Email already exists');
  //   }

  //   const existingPhone = await db
  //     .select()
  //     .from(User)
  //     .where(eq(User.phone, phone));

  //   if (existingPhone.length > 0) {
  //     throw new BadRequestException('Phone number already exists');
  //   }

  //   /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
  //   const secret = (speakeasy as any).generateSecret().base32;
  //   const otp = (speakeasy as any).totp({
  //     secret,
  //     encoding: 'base32',
  //     step: 300,
  //   });

  //   const expiresAt = Date.now() + 5 * 60 * 1000;

  //   this.otpStore[email] = {
  //     secret,
  //     expiresAt,
  //     userData: {
  //       fullname,
  //       phone,
  //       profile_url: filename,
  //       DateofBirth,
  //       Gender,
  //     },
  //   };
  //   /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

  //   try {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  //     await this.transporter.sendMail({
  //       from: `"Profile Verification" <${process.env.EMAIL_USER}>`,
  //       to: email,
  //       subject: 'Your OTP Code',
  //       text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
  //     });
  //   } catch (error) {
  //     console.error('Failed to send email:', error);
  //     delete this.otpStore[email];
  //     throw new BadRequestException(
  //       'Failed to send OTP email. Please check the email address.',
  //     );
  //   }

  //   return { message: 'OTP sent to email' };
  // }

  // async verifyOtp(email: string, userOtp: string) {
  //   const record = this.otpStore[email];
  //   if (!record) {
  //     throw new BadRequestException('OTP not sent to this email');
  //   }

  //   if (Date.now() > record.expiresAt) {
  //     delete this.otpStore[email];
  //     throw new BadRequestException('OTP expired');
  //   }

  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  //   const isValid = (speakeasy as any).totp.verify({
  //     secret: record.secret,
  //     encoding: 'base32',
  //     token: userOtp,
  //     step: 300,
  //     window: 1,
  //   });

  //   if (!isValid) {
  //     throw new BadRequestException('Invalid OTP');
  //   }

  //   const { fullname, phone, DateofBirth, Gender, profile_url } =
  //     record.userData;

  //   if (!profile_url || profile_url.trim() === '') {
  //     throw new BadRequestException('Profile image is missing');
  //   }

  //   const formattedDob = this.formatDate(DateofBirth);

  //   await db
  //     .insert(User)
  //     .values({
  //       fullname,
  //       phone,
  //       email,
  //       DateofBirth: formattedDob,
  //       Gender,
  //       profile_url,
  //       Update_At: new Date(),
  //     })
  //     .returning();

  //   delete this.otpStore[email];
  //   return {
  //     message: 'OTP verified successfully',
  //   };
  // }

  
}
