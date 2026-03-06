import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards.js';
import { ReviewsService } from './reviews.service.js';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Submit a review' })
    create(@Req() req, @Body() body: { productId: string; rating: number; comment: string }) {
        return this.reviewsService.create(req.user.id, body.productId, body.rating, body.comment);
    }

    @Get('product/:id')
    @ApiOperation({ summary: 'Get reviews for a product' })
    findByProduct(@Param('id') id: string) {
        return this.reviewsService.findByProduct(id);
    }
}
