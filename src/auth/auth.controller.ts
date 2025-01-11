import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-body.dto';
import { loginResDto } from './dto/login-res.dto';
import { refreshResDto } from './dto/refresh-res.dto';
import { RegisterBodyDto } from './dto/register-body.dto';
import { VerifyEmailResDto } from './dto/verify-email-res.dto';
import { VerifyEmailReqDto } from './dto/verify-email-req.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('post/login')
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    type: loginResDto,
    description: 'Successful login',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<loginResDto> {
    return this.authService.login(loginDto, response);
  }

  @Post('post/register')
  @ApiOperation({ summary: 'Register' })
  @ApiOkResponse({
    type: loginResDto,
    description: 'Successful register',
  })
  async register(
    @Body() registerBodyDto: RegisterBodyDto,
  ): Promise<{ status: number; message: string }> {
    return this.authService.register(registerBodyDto);
  }

  @Post('post/verify-email')
  @ApiOperation({ summary: 'Verify email' })
  @ApiOkResponse({
    type: VerifyEmailResDto,
    description: 'Successful verify email',
  })
  async verifyEmail(
    @Body() verifyEmailReq: VerifyEmailReqDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<VerifyEmailResDto> {
    return this.authService.confirmEmail(verifyEmailReq, response);
  }

  @Post('post/refresh')
  @ApiOperation({ summary: 'Refresh' })
  @ApiOkResponse({
    type: refreshResDto,
    description: 'Successful refresh',
  })
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
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({
    description: 'Successful logout',
  })
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
