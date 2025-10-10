import { Module } from '@nestjs/common';
import { FeedBackService } from './feed_back.service';
import { FeedBackController } from './feed_back.controller';

@Module({
  providers: [FeedBackService],
  controllers: [FeedBackController],
})
export class FeedBackModule {}
