import { ApiProperty } from '@nestjs/swagger';

export class refreshResDto {
  @ApiProperty()
  access_token: string;
}
