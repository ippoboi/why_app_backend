import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserQueryDto {
  @ApiProperty()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  username?: string;

  @ApiProperty()
  @IsString()
  occupation?: string;
}
