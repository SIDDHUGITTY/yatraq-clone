import { BadRequestException, Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import * as speakeasy from 'speakeasy';
import { db } from 'src/db/db.connection';
import { User } from 'src/db/schema';
import * as fs from 'fs';
import * as path from 'path';
import { LoginService } from 'src/login/login.service';
import { EmailService } from 'src/email/email.service';

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
export class ProfileService {
  private readonly uploadPath =
    process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads', 'CommentImages');

  private otpStore: OtpStorage = {};

  constructor(
    private readonly service: LoginService,
    private readonly emailService: EmailService,
  ) {
    try {
      if (!fs.existsSync(this.uploadPath)) {
        fs.mkdirSync(this.uploadPath, { recursive: true });
        console.log('📁 Image upload folder created:', this.uploadPath);
      }
    } catch (error) {
      console.error('❌ Failed to create upload directory:', error);
      console.log('⚠️ Using fallback upload path:', this.uploadPath);
    }
  }

  async sendOtpToEmail(
    fullname: string,
    phone: string,
    profile_url: Express.Multer.File,
    email: string,
    DateofBirth: string,
    Gender: string,
  ) {
    if (!profile_url) {
      throw new BadRequestException('Profile image is required');
    }

    // Save profile image
    const filename = `${Date.now()}-${profile_url.originalname}`;
    const filepath = path.join(this.uploadPath, filename);
    fs.writeFileSync(filepath, profile_url.buffer);

    // Ensure user exists
    await db.select().from(User).where(eq(User.email, email));

    // Generate OTP
    const secret = speakeasy.generateSecret().base32;
    const otp = speakeasy.totp({ secret, encoding: 'base32', step: 300 });
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

    this.otpStore[email] = {
      secret,
      expiresAt,
      userData: { fullname, phone, profile_url: filename, DateofBirth, Gender },
    };

    // Send OTP
    const emailSent = await this.emailService.sendOtpEmail(email, otp, fullname);
    if (emailSent) {
      console.log(`🔑 OTP for ${email}: ${otp} (Email sent successfully)`);
    }

    return { message: 'OTP sent to email ' };
  }

  async getDevOtp(email: string) {
    const record = this.otpStore[email];
    if (!record) return { message: 'No OTP found. Please send OTP first.' };

    if (Date.now() > record.expiresAt) {
      delete this.otpStore[email];
      return { message: 'OTP expired. Please request a new one.' };
    }

    return {
      message: 'OTP retrieved successfully (dev mode)',
      otp: 'Check server logs for actual OTP',
      expiresAt: new Date(record.expiresAt).toISOString(),
    };
  }

  async verifyOtp(phone: string, email: string, userOtp: string) {
    const record = this.otpStore[email];
    if (!record) throw new BadRequestException('OTP not sent to this email');

    if (Date.now() > record.expiresAt) {
      delete this.otpStore[email];
      throw new BadRequestException('OTP expired');
    }

    const isValid = speakeasy.totp.verify({
      secret: record.secret,
      encoding: 'base32',
      token: userOtp,
      step: 300,
      window: 1,
    });

    if (!isValid) throw new BadRequestException('Invalid OTP');

    const { fullname, DateofBirth, Gender, profile_url } = record.userData;

    // Format DOB safely
    let formattedDOB: string;
    try {
      if (DateofBirth && /^\d{8}$/.test(DateofBirth)) {
        const day = DateofBirth.substring(0, 2);
        const month = DateofBirth.substring(2, 4);
        const year = DateofBirth.substring(4, 8);
        formattedDOB = `${year}-${month}-${day}`;
      } else {
        const parsed = new Date(DateofBirth);
        if (isNaN(parsed.getTime())) throw new Error();
        formattedDOB = parsed.toISOString().split('T')[0];
      }
    } catch {
      throw new BadRequestException('Invalid Date of Birth format');
    }
    // Normalize base URL to avoid double slashes in the final URL
    const rawBaseUrl = process.env.BASE_URL || 'https://bustrackingsystemnew-production.up.railway.app';
    const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, '');
    const imageUrl = `${normalizedBaseUrl}/uploads/CommentImages/${profile_url}`;


    // Update user
    await db
      .update(User)
      .set({
        fullname,
        email,
        DateofBirth: formattedDOB,
        Gender,
        profile_url:imageUrl,
        Update_At: new Date(),
      })
      .where(eq(User.phone, phone))
      .returning();

    delete this.otpStore[email];
    return { message: 'OTP verified successfully' };
  }
}
