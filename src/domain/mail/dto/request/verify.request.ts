import { IsEmail } from 'class-validator';

export class VerifyMailRequest {
  @IsEmail()
  email: string;
}
