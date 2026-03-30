import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, Min, MaxLength, Matches } from 'class-validator';

export class CreateVersionDto {
  @ApiProperty({ example: '1.0.0' })
  @IsString()
  @MaxLength(50)
  version: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  changelog?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/\.(exe|msi|msix|zip|apk|ipa|dmg|pkg|tar\.gz)$/i, {
    message: 'downloadUrl must be a direct link ending with a valid application package format (.exe, .zip, .apk, .dmg, etc.) to prevent malicious executable scripts.',
  })
  downloadUrl?: string;

  @ApiPropertyOptional({ description: 'File size in bytes' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fileSize?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isLatest?: boolean;
}
