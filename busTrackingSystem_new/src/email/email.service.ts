import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';
import { Resend } from 'resend';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';
dotenv.config();

// config(); // load .env

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  private oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI,
  );

  constructor() {
    this.oauth2Client.setCredentials({      
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });
  }

  // constructor() {
  //   // this.initializeTransporter();
  // }

  // private initializeTransporter() {
  //   const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  //   const port = Number(process.env.SMTP_PORT) || 587;
  //   const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  //   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  //     this.logger.warn(
  //       '⚠️ Email credentials not configured. Email functionality will be disabled.',
  //     );
  //     return;
  //   }

  //   try {
  //     this.transporter = nodemailer.createTransport({
  //       host,
  //       port,
  //       secure,
  //       auth: {
  //         user: process.env.EMAIL_USER,
  //          pass: process.env.EMAIL_PASSWORD // remove spaces
  //       },
  //       tls: {
  //         rejectUnauthorized: false, // helps if there are certificate issues
  //       },
  //       connectionTimeout: 20000,
  //       greetingTimeout: 10000,
  //       socketTimeout: 20000,
  //       pool: false,
  //       logger: true, // log SMTP communication
  //       debug: true,  // debug mode
  //     });

  //     // Verify SMTP connection
  //     this.transporter.verify((error, success) => {
  //       if (error) {
  //         this.logger.error('❌ SMTP verification failed:', error.message);
  //       } else {
  //         this.logger.log('✅ SMTP server is ready to send messages');
  //       }
  //     });
  //   } catch (error: any) {
  //     this.logger.error('❌ Failed to initialize email transporter:', error.message);
  //   }
  // }

  async sendEmail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    from?: string;
  }): Promise<boolean> {
    // if (!this.transporter) {
    //   this.logger.warn('⚠️ Email transporter not available. Skipping email send.');
    //   return false;
    // }

    // try {
    //   const resend = new Resend(`${process.env.RESEND_API_KEY}`);

    //   const params = {
    //     from: "Acme <onboarding@resend.dev>",
    //     to: ["adi.o432@gmail.com"],
    //     subject: "hello world",
    //     html: "<p>it works!</p>"
    //   };

    //   await resend.emails.send(params);


    //   // await resend.emails.send({
    //   //   from: process.env.RESEND_FROM || 'onboarding@resend.dev',
    //   //   to: options.to,
    //   //   subject: options.subject,
    //   //   text: options.text ?? '', 
    //   //   html: options.html,
    //   // });

    //   this.logger.log(`✅ Email sent successfully to ${options.to}`);
    //   return true;
    // } catch (error: any) {
    //   this.logger.error(`❌ Failed to send email to ${options.to}: ${error.message}`);
    //   return false;
    // }
    //  try {
    //   const accessToken = await this.oauth2Client.getAccessToken();

    //   const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       type: 'OAuth2',
    //       user: process.env.GMAIL_USER,
    //       clientId: process.env.GMAIL_CLIENT_ID,
    //       clientSecret: process.env.GMAIL_CLIENT_SECRET,
    //       refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    //       accessToken: accessToken.token,
    //     },
    //   });

    //   //const recipients = Array.isArray(options.to) ? options.to.join(',') : options.to;

    //   await transporter.sendMail({
    //     from: `Bus Tracking <${process.env.GMAIL_USER}>`,
    //     to: options.to,
    //     subject: options.subject,
    //     html: options.html,
    //   });

    //   this.logger.log(`Email sent successfully to ${options.to}`);
    //   return true;
    // } catch (err) {
    //   this.logger.error('Error sending email', err);
    //   return false
    //   throw err;
    // }

    console.log(process.env.GMAIL_REFRESH_TOKEN)

    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

      // Create email message
      const messageParts = [
        `From: "Bus Tracking" <${process.env.GMAIL_USER}>`,
        `To: ${options.to}`,
        `Subject: ${options.subject}`,
        'Content-Type: text/html; charset=utf-8',
        '',
        options.html || options.text || '',
      ];

      const message = Buffer.from(messageParts.join('\n'))
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, ''); // Gmail API requires URL-safe base64

      // Send email
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: message,
        },
      });
      

      console.log('✅ Email sent successfully!');
      return true;
    } catch (err) {
      console.error('❌ Gmail API Error:', err);
      throw err;
      
    }
  }
  
  

  async sendOtpEmail(email: string, otp: string, fullname: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Your OTP Code - Bus Tracking System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello ${fullname}!</h2>
          <p>Your OTP code for the Bus Tracking System is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p><strong>This code will expire in 5 minutes.</strong></p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from the Bus Tracking System.
          </p>
        </div>
      `,
      text: `Hello ${fullname}! Your OTP code is: ${otp}. This code will expire in 5 minutes.`,
    });
  }

  async sendWelcomeEmail(email: string, fullname: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to Bus Tracking System!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome ${fullname}!</h2>
          <p>Your account has been successfully created in the Bus Tracking System.</p>
          <p>You can now:</p>
          <ul>
            <li>Track buses in real-time</li>
            <li>Receive notifications about your routes</li>
            <li>Access all system features</li>
          </ul>
          <p>Thank you for using our service!</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from the Bus Tracking System.
          </p>
        </div>
      `,
      text: `Welcome ${fullname}! Your account has been successfully created in the Bus Tracking System.`,
    });
  }

  isEmailConfigured(): boolean {
    return !!(
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASSWORD &&
      this.transporter
    );
  }
}
