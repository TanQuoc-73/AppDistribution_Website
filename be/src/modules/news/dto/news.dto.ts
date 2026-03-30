import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false })
  excerpt?: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ required: false })
  cover_image?: string;

  @ApiProperty({ required: false })
  product_id?: string;

  @ApiProperty({ required: false })
  author_id?: string;
}

export class UpdateNewsDto extends PartialType(CreateNewsDto) {}
