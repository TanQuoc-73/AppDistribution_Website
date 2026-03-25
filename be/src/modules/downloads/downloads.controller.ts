import { Controller, Post, Get, Param, Query, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DownloadsService } from './downloads.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('downloads')
@Controller('downloads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}

  @Post(':productId')
  @ApiOperation({ summary: 'Lấy link tải về (kiểm tra quyền sở hữu)' })
  download(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('versionId') versionId: string | undefined,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const ip: string | undefined =
      (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0].trim() ??
      req.ip;
    return this.downloadsService.download(user.id, productId, versionId, ip);
  }

  @Get('history')
  @ApiOperation({ summary: 'Lịch sử tải về của tôi' })
  history(@CurrentUser() user: any) {
    return this.downloadsService.getHistory(user.id);
  }
}
