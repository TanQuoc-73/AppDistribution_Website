import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, JwtAuthGuard],
  exports: [ProductsService],
})
export class ProductsModule {}
