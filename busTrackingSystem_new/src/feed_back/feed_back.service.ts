import { Injectable } from '@nestjs/common';
import { db } from 'src/db/db.connection';
import { feed_back } from 'src/db/schema';

@Injectable()
export class FeedBackService {
  async createfeedback(name: string, feedback: string) {
    const result = await db
      .insert(feed_back)
      .values({ name, feedback })
      .returning();
    return result;
  }
}
