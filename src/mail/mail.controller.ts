import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('test')
  @UseGuards(AuthGuard('jwtAuth'))
  async testEmail(@Body() body: { email: string }) {
    await this.mailService.sendMail({
      to: body.email,
      subject: 'Test Email',
      text: 'This is a test email from your NestJS application',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from your NestJS application</p>
        <p>If you're seeing this, your email service is working correctly!</p>
      `,
    });

    return { message: 'Test email sent successfully' };
  }
}
