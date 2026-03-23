import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: ['pending', 'completed', 'cancelled', 'refunded'] })
  @IsEnum(['pending', 'completed', 'cancelled', 'refunded'])
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
}
