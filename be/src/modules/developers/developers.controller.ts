import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DevelopersService } from './developers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('developers')
@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @Get()
  @ApiOperation({ summary: 'List all developers' })
  findAll() {
    return this.developersService.findAll();
  }

  // ─── Developer self-management ────────────────────────────────────────────

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('developer', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thông tin developer của tôi' })
  getMyProfile(@CurrentUser() user: any) {
    return this.developersService.getMyProfile(user.id);
  }

  @Get('me/products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('developer', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sản phẩm của developer tôi' })
  getMyProducts(@CurrentUser() user: any) {
    return this.developersService.getMyProducts(user.id);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('developer', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thống kê developer' })
  getStats(@CurrentUser() user: any) {
    return this.developersService.getStats(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('developer', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin developer' })
  updateMyProfile(
    @CurrentUser() user: any,
    @Body() body: { name?: string; description?: string; logoUrl?: string; website?: string; country?: string },
  ) {
    return this.developersService.updateMyProfile(user.id, body);
  }
}
