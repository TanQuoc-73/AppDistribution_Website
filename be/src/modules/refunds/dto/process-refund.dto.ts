import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ProcessRefundDto {
  @ApiPropertyOptional({ description: 'Admin notes about the decision' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminNotes?: string;
}
