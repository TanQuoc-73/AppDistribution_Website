import {
  Controller, Get, Post,
  Body, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefundsService } from './refunds.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('refunds')
@Controller('refunds')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Post('request')
  @ApiOperation({ summary: 'Gửi yêu cầu hoàn tiền' })
  request(@CurrentUser() user: any, @Body() dto: CreateRefundDto) {
    return this.refundsService.request(user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Danh sách yêu cầu hoàn tiền của tôi' })
  myRefunds(@CurrentUser() user: any) {
    return this.refundsService.findMyRefunds(user.id);
  }
}
