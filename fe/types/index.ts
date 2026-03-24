// Enums (mirror Prisma/DB enums)
export type UserRole = 'user' | 'developer' | 'admin';
export type ProductStatus = 'draft' | 'pending_review' | 'active' | 'inactive' | 'rejected';
export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'paypal' | 'wallet' | 'free';
export type MediaType = 'image' | 'video' | 'screenshot';
export type RefundStatus = 'pending' | 'approved' | 'rejected';
export type NotificationType = 'order' | 'refund' | 'review' | 'system' | 'promotion';
export type AgeRating = 'everyone' | 'teen' | 'mature' | 'adults_only';
export type CouponType = 'percentage' | 'fixed_amount';

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: UserRole;
  isActive: boolean;
  walletBalance: string; // Decimal as string
  createdAt: string;
  updatedAt: string;
}

export interface Developer {
  id: string;
  profileId: string;
  companyName: string;
  website: string | null;
  description: string | null;
  logoUrl: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  parentId: string | null;
  children?: Category[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ProductMedia {
  id: string;
  mediaType: MediaType;
  url: string;
  caption: string | null;
  sortOrder: number;
}

export interface ProductVersion {
  id: string;
  versionNumber: string;
  releaseNotes: string | null;
  downloadUrl: string;
  fileSize: number | null;
  isLatest: boolean;
  createdAt: string;
}

export interface ProductPlatform {
  id: string;
  platformName: string;
  minimumOs: string | null;
  recommendedOs: string | null;
  minimumRam: number | null;
  recommendedRam: number | null;
  storageRequired: number | null;
}

export interface Product {
  id: string;
  developerId: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  price: string; // Decimal as string
  discountPercent: number;
  isFree: boolean;
  status: ProductStatus;
  ageRating: AgeRating;
  releaseDate: string | null;
  totalDownloads: number;
  averageRating: string;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  developer?: Developer;
  categories?: Category[];
  tags?: Tag[];
  platforms?: ProductPlatform[];
  media?: ProductMedia[];
  versions?: ProductVersion[];
}

export interface CartItem {
  id: string;
  profileId: string;
  productId: string;
  addedAt: string;
  product: Product;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  priceAtOrder: string;
  product?: Product;
}

export interface Order {
  id: string;
  profileId: string;
  couponId: string | null;
  status: OrderStatus;
  subtotal: string;
  discountAmount: string;
  totalPrice: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
}

export interface Review {
  id: string;
  profileId: string;
  productId: string;
  rating: number;
  title: string | null;
  content: string | null;
  isRecommended: boolean | null;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
}

export interface Notification {
  id: string;
  profileId: string;
  notificationType: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedId: string | null;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginatedMeta;
}

// ─── Request / Query param types ─────────────────────────────────────────────

export interface QueryProductParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  developerId?: string;
  tag?: string;
  sort?: 'newest' | 'popular' | 'price_asc' | 'price_desc' | 'rating';
  isFree?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreateOrderPayload {
  productIds: string[];
  couponCode?: string;
  notes?: string;
}

export interface UpdateProfilePayload {
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
}
