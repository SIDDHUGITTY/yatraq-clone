import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { Request ,Response} from 'express';
import { AuthService, AuthPayload } from './auth.service';
import { google } from 'googleapis';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();


const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI,
);


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔑 Login / Create session
  @Post('create')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', example: '9876543210' },
      },
      required: ['phone'],
    },
  })
  async login(@Body() body: { phone: string }) {
    return this.authService.authenticate(body.phone);
  }

  // 🔑 Get profile (requires JWT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  getProfile(@Req() req: Request): AuthPayload {
    const user = req.user as AuthPayload | undefined;

    if (!user?.email) {
      throw new UnauthorizedException("Profile can't be created");
    }
    return user;
  }

  // 🔑 Logout (requires JWT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('logout')
  logout(
    @Req() req: Request,
  ): { message: string } | Promise<{ message: string }> {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return { message: '❌ No token found' };
    }
    return this.authService.logout();
  }

   @Get('google')
  redirectToGoogle(@Res() res: Response) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // gives refresh token
      scope: SCOPES,
      prompt: 'consent'
    });
    res.redirect(authUrl);
  }

  // Step 2: Google redirects back here with code
  // @Get('google/callback')
  // async googleCallback(@Query('code') code: string, @Res() res: Response) {
  //   try {
  //     const { tokens } = await oauth2Client.getToken(code);
  //     oauth2Client.setCredentials(tokens);

  //     // Save refresh_token securely for later use
  //     console.log('Access Token:', tokens.access_token);
  //     console.log('Refresh Token:', tokens.refresh_token);

  //     res.send(`
  //       <html>
  //         <head><title>OAuth Success</title></head>
  //         <body>
  //           <h1>Google OAuth Successful!</h1>
  //           <p>Check your server console for the Access & Refresh tokens.</p>
  //         </body>
  //       </html>
  //     `);

  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).send('Error during OAuth callback.');
  //   }
  // }

  @Get('google/callback')
  async googleCallback(@Query() query: any, @Res() res: Response) {
    console.log('Query params:', query); // <-- log everything

    const code = query.code;
    if (!code) {
      console.error('No code parameter received!');
      return res.status(400).send('Error: missing code parameter.');
    }

    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      console.log('Access Token:', tokens.access_token);
      console.log('Refresh Token:', tokens.refresh_token);

      res.send(`
        <h1>Google OAuth successful!</h1>
        <p>Check your server console for tokens.</p>
        <p>Refresh Token: ${tokens.refresh_token}</p>
        <p>Access Token: ${tokens.access_token}</p>
      `);
    } catch (err) {
      console.error('Error during getToken:', err);
      res.status(500).send('Error during OAuth callback.');
    }
  }

}
