import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ type: [String], description: 'Mảng product IDs' })
  @IsUUID('4', { each: true })
  productIds: string[];

  @ApiPropertyOptional({ description: 'Mã giảm giá' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
