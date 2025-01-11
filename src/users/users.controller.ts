import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserQueryDto } from './dto/user-query.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserResDto } from './dto/user-res.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/get')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwtAuth'))
  @ApiOperation({ summary: 'Get all users' })
  @ApiUnauthorizedResponse({ description: 'No right to access ressource' })
  @ApiNotFoundResponse({ description: 'Data not found' })
  @ApiOkResponse({
    type: [UserQueryDto],
    description: 'Successful retrieval',
  })
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get('/get/me')
  @UseGuards(AuthGuard('jwtAuth'))
  async getMe(@Request() req): Promise<UserResDto> {
    // The user object will be attached to the request by Passport
    return req.user;
  }
}
