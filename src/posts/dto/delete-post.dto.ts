import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeletePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly user_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly post_id: number;
}
