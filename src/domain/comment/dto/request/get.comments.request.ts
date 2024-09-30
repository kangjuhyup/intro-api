import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetCommentsRequest {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  skip: number;
}
