import { Module } from '@nestjs/common';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  controllers: [WishlistsController],
  providers: [WishlistsService],
  exports: [WishlistsService],
  imports: [ProfilesModule],
})
export class WishlistsModule {}
