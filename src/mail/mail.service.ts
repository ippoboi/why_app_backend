import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async sendMail({ to, subject, text, html }) {
    // Send mail with defined transport object
    const info = await this.transporter.sendMail({
      from: '"Why App" <noreply@whyapp.com>',
      to,
      subject,
      text,
      html,
    });

    return info;
  }
}
