import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, MaxLength } from 'class-validator';

export class CreateRefundDto {
  @ApiProperty({ description: 'Order item ID to refund' })
  @IsUUID()
  orderItemId: string;

  @ApiProperty({ description: 'Reason for refund request' })
  @IsString()
  @MaxLength(2000)
  reason: string;
}
