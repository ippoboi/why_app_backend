import { ApiProperty } from '@nestjs/swagger';
import {
  FistBump,
  Personality,
  SavedQuote,
  WhyStatement,
} from '@prisma/client';
import { IsArray, IsDate, IsEmail, IsNumber, IsString } from 'class-validator';

export class UserResDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  occupation: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsArray()
  whyStatements: WhyStatement[];

  @ApiProperty()
  @IsArray()
  savedQuotes: SavedQuote[];

  @ApiProperty()
  @IsArray()
  favoritePersonalities: Personality[];

  @ApiProperty()
  @IsArray()
  fistBumps: FistBump[];
}
