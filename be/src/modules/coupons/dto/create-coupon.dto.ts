import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsOptional, IsEnum, IsNumber, IsInt,
  IsBoolean, IsDateString, Min, MaxLength,
} from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ description: 'Coupon code (unique)' })
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiPropertyOptional({ description: 'Coupon description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ enum: ['percentage', 'fixed'], default: 'percentage' })
  @IsEnum(['percentage', 'fixed'] as const)
  discountType: 'percentage' | 'fixed';

  @ApiProperty({ description: 'Discount value' })
  @IsNumber()
  @Min(0.01)
  discountValue: number;

  @ApiPropertyOptional({ description: 'Minimum order value', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderValue?: number;

  @ApiPropertyOptional({ description: 'Max discount amount (for percentage type)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @ApiPropertyOptional({ description: 'Maximum number of uses' })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxUses?: number;

  @ApiPropertyOptional({ description: 'Is coupon active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Valid from date (ISO string)' })
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @ApiPropertyOptional({ description: 'Valid until date (ISO string)' })
  @IsOptional()
  @IsDateString()
  validUntil?: string;
}
