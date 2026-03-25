import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, OrderStatus } from '@prisma/client';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /* ─── Dashboard ─── */

  @Get('stats')
  @ApiOperation({ summary: 'Dashboard statistics' })
  getStats() {
    return this.adminService.getStats();
  }

  /* ─── Users ─── */

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  getUsers(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.findAllUsers(+page, +limit);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Update user role' })
  updateUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('role') role: UserRole,
  ) {
    return this.adminService.updateUserRole(id, role);
  }

  @Patch('users/:id/toggle-active')
  @ApiOperation({ summary: 'Toggle user active status' })
  toggleUserActive(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.toggleUserActive(id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Update user details' })
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { username?: string; displayName?: string; bio?: string; role?: UserRole },
  ) {
    return this.adminService.updateUser(id, body);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user' })
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteUser(id);
  }

  /* ─── Products ─── */

  @Get('products')
  @ApiOperation({ summary: 'List all products (admin)' })
  getProducts(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.findAllProducts(+page, +limit);
  }

  @Post('products')
  @ApiOperation({ summary: 'Create product' })
  createProduct(
    @Body() body: { name: string; slug: string; shortDescription?: string; description?: string; thumbnailUrl?: string; price?: number; discountPercent?: number; isFree?: boolean; ageRating?: string; developerId?: string; releaseDate?: string },
  ) {
    return this.adminService.createProduct(body);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Update product' })
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { name?: string; slug?: string; shortDescription?: string; description?: string; thumbnailUrl?: string; price?: number; discountPercent?: number; isFree?: boolean; is_active?: boolean; is_featured?: boolean; ageRating?: string; developerId?: string; releaseDate?: string },
  ) {
    return this.adminService.updateProduct(id, body);
  }

  @Patch('products/:id/status')
  @ApiOperation({ summary: 'Update product status' })
  updateProductStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { isActive: boolean; isFeatured?: boolean },
  ) {
    return this.adminService.updateProductStatus(id, body.isActive, body.isFeatured);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete product' })
  deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteProduct(id);
  }

  /* ─── Orders ─── */

  @Get('orders')
  @ApiOperation({ summary: 'List all orders' })
  getOrders(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.findAllOrders(+page, +limit);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get order detail' })
  getOrderDetail(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getOrderDetail(id);
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Update order status' })
  updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.adminService.updateOrderStatus(id, status);
  }

  /* ─── News ─── */

  @Get('news')
  @ApiOperation({ summary: 'List all news (admin)' })
  getNews(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.findAllNewsAdmin(+page, +limit);
  }

  @Post('news')
  @ApiOperation({ summary: 'Create news article' })
  createNews(
    @Body() body: { title: string; slug: string; content: string; excerpt?: string; cover_image?: string; isPublished?: boolean },
  ) {
    return this.adminService.createNews(body);
  }

  @Patch('news/:id')
  @ApiOperation({ summary: 'Update news article' })
  updateNews(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { title?: string; slug?: string; content?: string; excerpt?: string; cover_image?: string; isPublished?: boolean },
  ) {
    return this.adminService.updateNews(id, body);
  }

  @Delete('news/:id')
  @ApiOperation({ summary: 'Delete news article' })
  deleteNews(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteNews(id);
  }

  /* ─── Banners ─── */

  @Get('banners')
  @ApiOperation({ summary: 'List all banners (admin)' })
  getBanners(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.findAllBanners(+page, +limit);
  }

  @Post('banners')
  @ApiOperation({ summary: 'Create banner' })
  createBanner(
    @Body() body: { title: string; imageUrl: string; linkUrl?: string; sortOrder?: number; isActive?: boolean },
  ) {
    return this.adminService.createBanner(body);
  }

  @Patch('banners/:id')
  @ApiOperation({ summary: 'Update banner' })
  updateBanner(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { title?: string; imageUrl?: string; linkUrl?: string; sortOrder?: number; isActive?: boolean },
  ) {
    return this.adminService.updateBanner(id, body);
  }

  @Delete('banners/:id')
  @ApiOperation({ summary: 'Delete banner' })
  deleteBanner(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteBanner(id);
  }
}
