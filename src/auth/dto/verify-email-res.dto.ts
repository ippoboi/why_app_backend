import { IsString } from 'class-validator';

export class VerifyEmailResDto {
  @IsString()
  access_token: string;
}
