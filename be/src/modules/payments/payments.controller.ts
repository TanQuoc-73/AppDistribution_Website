import { Controller, Post, Get, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentsService, MockPaymentMethod } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

class MockPayDto {
  @ApiProperty({ example: 'uuid-of-order' })
  @IsUUID()
  orderId: string;

  @ApiProperty({ enum: ['bank_transfer', 'credit_card', 'paypal_mock', 'wallet'] })
  @IsEnum(['bank_transfer', 'credit_card', 'paypal_mock', 'wallet'])
  method: MockPaymentMethod;
}

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('mock')
  @ApiOperation({ summary: 'Thanh toán giả lập (test/demo)' })
  mockPay(@CurrentUser() user: any, @Body() dto: MockPayDto) {
    return this.paymentsService.mockPay(user.id, dto.orderId, dto.method);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Lấy thông tin thanh toán theo đơn hàng' })
  getByOrder(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @CurrentUser() user: any,
  ) {
    return this.paymentsService.getByOrder(orderId, user.id);
  }
}
