import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
