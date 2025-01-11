import { ApiProperty } from '@nestjs/swagger';
import { Occupation } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  occupation: Occupation;

  @ApiProperty()
  @IsNumber()
  notifyHour: number;
}
