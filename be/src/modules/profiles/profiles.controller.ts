import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('profiles')
@Controller('profiles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Lấy hồ sơ của tôi' })
  getMe(@CurrentUser() user: any) {
    return this.profilesService.findById(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Cập nhật hồ sơ' })
  updateMe(@CurrentUser() user: any, @Body() body: { username?: string; avatarUrl?: string }) {
    return this.profilesService.update(user.id, body);
  }

  @Get('me/wallet')
  @ApiOperation({ summary: 'Số dư ví' })
  getWallet(@CurrentUser() user: any) {
    return this.profilesService.getWalletBalance(user.id);
  }
}
