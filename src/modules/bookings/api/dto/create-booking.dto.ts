import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  resourceId!: string;

  @IsISO8601()
  start!: string;

  @IsISO8601()
  end!: string;
}
