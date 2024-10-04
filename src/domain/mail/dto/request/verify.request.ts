import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class VerifyMailRequest {
  @IsString()
  email: string;
  @Transform(({ value }) => Number(value))
  @IsNumber()
  historyId: number;
}
