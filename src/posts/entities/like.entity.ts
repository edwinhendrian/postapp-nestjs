import { ApiProperty } from '@nestjs/swagger';
import { Like } from '@prisma/client';

export class LikeEntity implements Like {
  @ApiProperty()
  post_id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  created_at: Date;
}
