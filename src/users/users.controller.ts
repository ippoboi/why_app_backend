import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserQueryDto } from './dto/user-query.dto';
import { UserResDto } from './dto/user-res.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/get')
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
  @ApiUnauthorizedResponse({ description: 'No right to access ressource' })
  @ApiNotFoundResponse({ description: 'Data not found' })
  @ApiOkResponse({
    type: UserResDto,
    description: 'Successful retrieval',
  })
  async getMe(@Request() req): Promise<UserResDto> {
    // The user object will be attached to the request by Passport
    return req.user;
  }

  @Patch('/patch')
  @UseGuards(AuthGuard('jwtAuth'))
  @ApiUnauthorizedResponse({ description: 'No right to access ressource' })
  @ApiNotFoundResponse({ description: 'Data not found' })
  @ApiOkResponse({
    description: 'Successful update',
  })
  async updateUser(@Request() req, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(req.user.userId, body);
  }
}
