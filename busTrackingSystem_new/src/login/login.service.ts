import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { eq } from 'drizzle-orm';
import { db } from 'src/db/db.connection';
import { User } from 'src/db/schema';

@Injectable()
export class LoginService {
  private clerkUrl = 'https://api.clerk.dev/v1/phone_numbers';
  private apiKey = process.env.CLERK_SECRET_KEY;

  async sendOtp(phone: string): Promise<unknown> {
    const response = await axios.post(
      `${this.clerkUrl}/phone_numbers`,
      { phone_number: phone },
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    );
    return response.data;
  }

  async verifyOtp(code: string, phone_id: string): Promise<unknown> {
    const response = await axios.post(
      `${this.clerkUrl}/phone_numbers/${phone_id}/verify`,
      { code },
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    );

    if (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      !response.data.verification ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      response.data.verification.status !== 'verified'
    ) {
      throw new BadRequestException('OTP verification failed.');
    }

    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
    const phone = response.data.phone_number;
    const result = await db.insert(User).values({ phone });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

    return result;
  }

  async getbyphone(phone: string) {
    const result = await db.select().from(User).where(eq(User.phone, phone));
    return result[0];
  }

  async create(phone: string) {
    const result = await db.insert(User).values({ phone }).returning();
    return {
      result,
    };
  }

  async emailExist(email: string) {
    const result = await db.select().from(User).where(eq(User.email, email));
    return result[0];
  }
}
