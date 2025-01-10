import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login-body.dto';
import { loginResDto } from './dto/login-res.dto';
import { refreshResDto } from './dto/refresh-res.dto';
import { RegisterBodyDto } from './dto/register-body.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
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
    userId: string,
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
    response: Response,
  ): Promise<loginResDto> {
    const user = await this.usersService.createUser({
      email: registerBodyDto.email,
      username: registerBodyDto.username,
      password: this.hashPassword(registerBodyDto.password),
    });

    const tokens = await this.generateTokens(user.userId);

    response.cookie('refresh_token', tokens.refresh_token, this.cookieOptions);

    return {
      access_token: tokens.access_token,
    };
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

  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword;
  }
}
