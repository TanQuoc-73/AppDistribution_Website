import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CouponsModule } from '../coupons/coupons.module';
import { RefundsModule } from '../refunds/refunds.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [CouponsModule, RefundsModule, TagsModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
