import { IsEmail } from 'class-validator';

export class SendMailRequest {
  @IsEmail()
  to: string;
}
