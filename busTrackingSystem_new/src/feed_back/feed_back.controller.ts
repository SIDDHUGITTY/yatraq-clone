import { Body, Controller, Post } from '@nestjs/common';
import { FeedBackService } from './feed_back.service';

@Controller('feed-back')
export class FeedBackController {
  constructor(private readonly service: FeedBackService) {}
  @Post('create')
  async createfeedback(@Body() body: { name: string; feedback: string }) {
    const result = await this.service.createfeedback(body.name, body.feedback);
    return result;
  }
}
