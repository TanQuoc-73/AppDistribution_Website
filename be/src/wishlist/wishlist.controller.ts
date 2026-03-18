import { Controller, Post, Get, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards.js';
import { WishlistService } from './wishlist.service.js';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
    constructor(private wishlistService: WishlistService) { }

    @Post()
    @ApiOperation({ summary: 'Add product to wishlist' })
    add(@Req() req, @Body() body: { productId: string }) {
        return this.wishlistService.add(req.user.id, body.productId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove from wishlist' })
    remove(@Param('id') id: string) {
        return this.wishlistService.remove(id);
    }

    @Delete('product/:productId')
    @ApiOperation({ summary: 'Remove from wishlist by productId (current user)' })
    removeByProduct(@Req() req, @Param('productId') productId: string) {
        return this.wishlistService.removeByProduct(req.user.id, productId);
    }

    @Get('user')
    @ApiOperation({ summary: 'Get user wishlist' })
    findByUser(@Req() req) {
        return this.wishlistService.findByUser(req.user.id);
    }
}
