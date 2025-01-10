import { ApiProperty } from '@nestjs/swagger';

export class loginResDto {
  @ApiProperty()
  access_token: string;
}
