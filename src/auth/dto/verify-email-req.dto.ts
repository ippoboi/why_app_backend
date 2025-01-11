import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyEmailReqDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
