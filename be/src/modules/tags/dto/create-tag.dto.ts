import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: 'Tag name' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Tag slug (URL-friendly)' })
  @IsString()
  @MaxLength(100)
  slug: string;
}
