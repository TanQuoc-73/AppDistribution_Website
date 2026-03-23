import { Controller, Get, Post, Delete, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy giỏ hàng của tôi' })
  getCart(@CurrentUser() user: any) {
    return this.cartService.getCart(user.id);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ' })
  addItem(@CurrentUser() user: any, @Param('productId', ParseUUIDPipe) productId: string) {
    return this.cartService.addItem(user.id, productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Xoá sản phẩm khỏi giỏ' })
  removeItem(@CurrentUser() user: any, @Param('productId', ParseUUIDPipe) productId: string) {
    return this.cartService.removeItem(user.id, productId);
  }

  @Delete()
  @ApiOperation({ summary: 'Xoá toàn bộ giỏ hàng' })
  clearCart(@CurrentUser() user: any) {
    return this.cartService.clearCart(user.id);
  }
}
