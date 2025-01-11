import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login-body.dto';
import { loginResDto } from './dto/login-res.dto';
import { refreshResDto } from './dto/refresh-res.dto';
import { RegisterBodyDto } from './dto/register-body.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { VerifyEmailResDto } from './dto/verify-email-res.dto';
import { VerifyEmailReqDto } from './dto/verify-email-req.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  private readonly cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/auth/post/refresh',
  };

  async checkCredentials(loginDto: LoginDto) {
    const user = await this.usersService.getUserByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async generateTokens(
    userId: number,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: process.env.ACCESS_SECRET,
          expiresIn: process.env.ACCESS_EXP,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: process.env.REFRESH_SECRET,
          expiresIn: process.env.REFRESH_EXP,
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async login(loginDto: LoginDto, response: Response): Promise<loginResDto> {
    const user = await this.checkCredentials(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.userId);

    response.cookie('refresh_token', tokens.refresh_token, this.cookieOptions);

    return {
      access_token: tokens.access_token,
    };
  }

  async register(
    registerBodyDto: RegisterBodyDto,
  ): Promise<{ status: number; message: string }> {
    try {
      const user = await this.usersService.createUser({
        email: registerBodyDto.email,
        username: registerBodyDto.username,
        password: this.hashPassword(registerBodyDto.password),
      });

      const tempCode = await this.getTempCode(user.email);

      // TODO when app crashes, and you try to register again make sure to not block the user

      // TODO: change to use html + make a function that takes the user and tempCode
      await this.mailService.sendMail({
        to: user.email,
        subject: 'Confirm your email',
        text: `Your 6-digit code is ${tempCode}`,
        html: `
          <h1>Confirm your email</h1>
          <p>Your 6-digit code is ${tempCode}</p>
        `,
      });

      return { status: HttpStatus.OK, message: 'Mail sent successfully' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException('Email already in use', HttpStatus.FORBIDDEN);
        }
      }
      throw error;
    }
  }

  async confirmEmail(
    verifyEmailReqDto: VerifyEmailReqDto,
    response: Response,
  ): Promise<VerifyEmailResDto> {
    const user = await this.usersService.getUserByEmail(
      verifyEmailReqDto.email,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    if (user.verified) {
      throw new BadRequestException('Email already verified');
    }

    const tokens = await this.generateTokens(user.userId);

    await this.verifyTempCode(verifyEmailReqDto.code, user.userId);

    response.cookie('refresh_token', tokens.refresh_token, this.cookieOptions);

    return {
      access_token: tokens.access_token,
    };
  }

  async resendCode(
    email: string,
  ): Promise<{ status: number; message: string }> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    if (user.verified) {
      throw new BadRequestException('Email already verified');
    }

    const tempCode = await this.getTempCode(user.email);

    await this.mailService.sendMail({
      to: email,
      subject: 'Confirm your email',
      text: `Your 6-digit code is ${tempCode}`,
      html: `
          <h1>Confirm your email</h1>
          <p>Your 6-digit code is ${tempCode}</p>
        `,
    });
    return { status: HttpStatus.OK, message: 'Code resent successfully' };
  }

  async refreshTokens(
    refreshToken: string,
    response: Response,
  ): Promise<refreshResDto> {
    const payload = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_SECRET,
    });

    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(payload.sub);

    response.cookie('refresh_token', tokens.refresh_token, this.cookieOptions);

    return {
      access_token: tokens.access_token,
    };
  }

  async logout(response: Response) {
    response.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  // generate code
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // get temp code
  async getTempCode(email: string): Promise<string | undefined> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const code = this.generateCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // First find existing code
    const existingCode = await this.prisma.tempCode.findFirst({
      where: { userId: user.userId },
    });

    if (existingCode) {
      // Update existing code
      await this.prisma.tempCode.update({
        where: { codeId: existingCode.codeId },
        data: {
          code,
          expiresAt,
        },
      });
    } else {
      // Create new code
      await this.prisma.tempCode.create({
        data: {
          code,
          expiresAt,
          user: { connect: { userId: user.userId } },
        },
      });
    }

    return code;
  }

  // verify temp code
  async verifyTempCode(code: string, userId: number) {
    const tempCode = await this.prisma.tempCode.findFirst({
      where: { code: code, userId: userId },
    });

    if (!tempCode) {
      throw new BadRequestException('Invalid code');
    }

    if (tempCode.expiresAt < new Date()) {
      throw new BadRequestException('Code expired');
    }

    await this.prisma.tempCode.deleteMany({
      where: { code: code, userId: userId },
    });

    await this.usersService.verifyUser(userId);

    return { status: HttpStatus.OK, message: 'Code verified successfully' };
  }

  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword;
  }
}
