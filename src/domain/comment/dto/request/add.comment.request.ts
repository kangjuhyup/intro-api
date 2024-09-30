import { IsEmail, IsString, IsUrl, MaxLength } from 'class-validator';

export class AddCommentRequest {
  @IsEmail()
  email: string;
  @IsString()
  @MaxLength(20)
  name: string;
  @IsString()
  @MaxLength(200)
  comment: string;
  @IsUrl()
  avartar: string;
}
