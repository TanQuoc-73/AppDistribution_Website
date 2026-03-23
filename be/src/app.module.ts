import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { DevelopersModule } from './modules/developers/developers.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TagsModule } from './modules/tags/tags.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { LibraryModule } from './modules/library/library.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RefundsModule } from './modules/refunds/refunds.module';
import { DownloadsModule } from './modules/downloads/downloads.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { BannersModule } from './modules/banners/banners.module';
import { NewsModule } from './modules/news/news.module';
import { AdminModule } from './modules/admin/admin.module';
import appConfig from './config/app.config';
import supabaseConfig from './config/supabase.config';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, supabaseConfig],
    }),
    // Rate limiting
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    // Database
    DatabaseModule,
    // Feature modules
    AuthModule,
    ProfilesModule,
    DevelopersModule,
    ProductsModule,
    CategoriesModule,
    TagsModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    LibraryModule,
    ReviewsModule,
    WishlistsModule,
    NotificationsModule,
    RefundsModule,
    DownloadsModule,
    CouponsModule,
    BannersModule,
    NewsModule,
    AdminModule,
  ],
})
export class AppModule {}
