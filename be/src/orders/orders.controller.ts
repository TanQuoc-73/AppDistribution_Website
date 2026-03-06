import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards.js';
import { OrdersService } from './orders.service.js';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create an order' })
    create(
        @Req() req,
        @Body() body: { items: { productId: string; price: number }[] },
    ) {
        return this.ordersService.create(req.user.id, body.items);
    }

    @Get('user')
    @ApiOperation({ summary: 'Get orders for logged-in user' })
    findByUser(@Req() req) {
        return this.ordersService.findByUser(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by ID' })
    findById(@Param('id') id: string) {
        return this.ordersService.findById(id);
    }
}
