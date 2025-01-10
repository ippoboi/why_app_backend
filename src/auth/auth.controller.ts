import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-body.dto';
import { refreshResDto } from './dto/refresh-res.dto';
import { loginResDto } from './dto/login-res.dto';
import { RegisterBodyDto } from './dto/register-body.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('post/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<loginResDto> {
    return this.authService.login(loginDto, response);
  }

  @Post('post/register')
  async register(
    @Body() registerBodyDto: RegisterBodyDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<loginResDto> {
    return this.authService.register(registerBodyDto, response);
  }

  @Post('post/refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<refreshResDto> {
    const refreshToken = request.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    return this.authService.refreshTokens(refreshToken, response);
  }

  @Post('post/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
