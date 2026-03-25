import { Controller, Get, Post, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('library')
@Controller('library')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  @ApiOperation({ summary: 'Thư viện sản phẩm của tôi' })
  getLibrary(@CurrentUser() user: any) {
    return this.libraryService.getLibrary(user.id);
  }

  @Get('check/:productId')
  @ApiOperation({ summary: 'Kiểm tra quyền sở hữu sản phẩm' })
  checkOwnership(
    @Param('productId', ParseUUIDPipe) productId: string,
    @CurrentUser() user: any,
  ) {
    return this.libraryService.checkOwnership(user.id, productId).then((owned) => ({ owned }));
  }

  @Post('claim/:productId')
  @ApiOperation({ summary: 'Thêm sản phẩm miễn phí vào thư viện' })
  claimFree(
    @Param('productId', ParseUUIDPipe) productId: string,
    @CurrentUser() user: any,
  ) {
    return this.libraryService.claimFree(user.id, productId);
  }
}
