import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class VoteReviewDto {
  @ApiProperty({ description: 'Is this review helpful?' })
  @IsBoolean()
  isHelpful: boolean;
}
