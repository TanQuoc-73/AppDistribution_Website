import { ApiProperty } from '@nestjs/swagger';

export class NewsEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  author_id?: string;

  @ApiProperty()
  product_id?: string;

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

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty({ required: false })
  publishedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  profiles?: any;

  @ApiProperty({ required: false })
  products?: any;
}
