import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class VerifyMailRequest {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  historyId: number;
}
