import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'List published news' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.newsService.findAll(+page, +limit);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get news article by slug' })
  findOne(@Param('slug') slug: string) {
    return this.newsService.findBySlug(slug);
  }
}
