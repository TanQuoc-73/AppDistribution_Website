import {
  Controller, Get, Post, Delete,
  Param, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('wishlists')
@Controller('wishlists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách yêu thích của tôi' })
  getWishlist(@CurrentUser() user: any) {
    return this.wishlistsService.getWishlist(user.id);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Thêm vào danh sách yêu thích' })
  add(
    @CurrentUser() user: any,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.wishlistsService.add(user.id, productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Xoá khỏi danh sách yêu thích' })
  remove(
    @CurrentUser() user: any,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.wishlistsService.remove(user.id, productId);
  }

  @Get('check/:productId')
  @ApiOperation({ summary: 'Kiểm tra sản phẩm có trong wishlist không' })
  check(
    @CurrentUser() user: any,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.wishlistsService.check(user.id, productId);
  }
}
