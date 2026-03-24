import api from '../client';
import type {
  Product,
  ApiResponse,
  PaginatedResponse,
  QueryProductParams,
  CreateOrderPayload,
  Order,
  CartItem,
  Profile,
  UpdateProfilePayload,
  Review,
  Notification,
  NewsArticle,
  Banner,
  Category,
  Tag,
} from '@/types';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  signUp: (payload: { email: string; password: string; username: string }) =>
    api.post<ApiResponse<{ user: unknown; session: unknown }>>('/auth/sign-up', payload),

  signIn: (payload: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: unknown; session: unknown }>>('/auth/sign-in', payload),

  signOut: () =>
    api.post<ApiResponse<null>>('/auth/sign-out'),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<{ session: unknown }>>('/auth/refresh', { refreshToken }),
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  getAll: (params?: QueryProductParams) =>
    api.get<PaginatedResponse<Product>>('/products', { params }),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Product>>(`/products/${slug}`),

  create: (payload: Partial<Product>) =>
    api.post<ApiResponse<Product>>('/products', payload),

  update: (id: string, payload: Partial<Product>) =>
    api.patch<ApiResponse<Product>>(`/products/${id}`, payload),

  remove: (id: string) =>
    api.delete<ApiResponse<null>>(`/products/${id}`),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────

export const cartApi = {
  get: () =>
    api.get<ApiResponse<CartItem[]>>('/cart'),

  addItem: (productId: string) =>
    api.post<ApiResponse<CartItem>>(`/cart/${productId}`),

  removeItem: (productId: string) =>
    api.delete<ApiResponse<null>>(`/cart/${productId}`),

  clear: () =>
    api.delete<ApiResponse<null>>('/cart'),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const ordersApi = {
  create: (payload: CreateOrderPayload) =>
    api.post<ApiResponse<Order>>('/orders', payload),

  getMy: () =>
    api.get<ApiResponse<Order[]>>('/orders/my'),

  getMyById: (id: string) =>
    api.get<ApiResponse<Order>>(`/orders/my/${id}`),
};

// ─── Profiles ─────────────────────────────────────────────────────────────────

export const profilesApi = {
  getMe: () =>
    api.get<ApiResponse<Profile>>('/profiles/me'),

  updateMe: (payload: UpdateProfilePayload) =>
    api.patch<ApiResponse<Profile>>('/profiles/me', payload),

  getWallet: () =>
    api.get<ApiResponse<{ balance: string }>>('/profiles/me/wallet'),
};

// ─── Library ──────────────────────────────────────────────────────────────────

export const libraryApi = {
  getAll: () =>
    api.get<ApiResponse<Product[]>>('/library'),
};

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviewsApi = {
  getByProduct: (productId: string) =>
    api.get<ApiResponse<Review[]>>(`/reviews/product/${productId}`),

  create: (payload: { productId: string; rating: number; title?: string; content?: string; isRecommended?: boolean }) =>
    api.post<ApiResponse<Review>>('/reviews', payload),

  update: (id: string, payload: Partial<Pick<Review, 'rating' | 'title' | 'content' | 'isRecommended'>>) =>
    api.patch<ApiResponse<Review>>(`/reviews/${id}`, payload),

  remove: (id: string) =>
    api.delete<ApiResponse<null>>(`/reviews/${id}`),

  vote: (reviewId: string, isHelpful: boolean) =>
    api.post<ApiResponse<null>>(`/reviews/${reviewId}/vote`, { isHelpful }),
};

// ─── Wishlists ────────────────────────────────────────────────────────────────

export const wishlistsApi = {
  get: () =>
    api.get<ApiResponse<Product[]>>('/wishlists'),

  add: (productId: string) =>
    api.post<ApiResponse<null>>(`/wishlists/${productId}`),

  remove: (productId: string) =>
    api.delete<ApiResponse<null>>(`/wishlists/${productId}`),
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationsApi = {
  getAll: () =>
    api.get<ApiResponse<Notification[]>>('/notifications'),

  markRead: (id: string) =>
    api.patch<ApiResponse<null>>(`/notifications/${id}/read`),

  markAllRead: () =>
    api.patch<ApiResponse<null>>('/notifications/read-all'),
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesApi = {
  getAll: () =>
    api.get<ApiResponse<Category[]>>('/categories'),
};

// ─── Tags ─────────────────────────────────────────────────────────────────────

export const tagsApi = {
  getAll: () =>
    api.get<ApiResponse<Tag[]>>('/tags'),
};

// ─── Banners ──────────────────────────────────────────────────────────────────

export const bannersApi = {
  getActive: () =>
    api.get<ApiResponse<Banner[]>>('/banners'),
};

// ─── News ─────────────────────────────────────────────────────────────────────

export const newsApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<NewsArticle>>('/news', { params }),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<NewsArticle>>(`/news/${slug}`),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  getStats: () =>
    api.get<ApiResponse<{ totalUsers: number; totalProducts: number; totalOrders: number; totalRevenue: number }>>('/admin/stats'),

  // Users
  getUsers: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Profile>>('/admin/users', { params }),
  updateUserRole: (id: string, role: string) =>
    api.patch<ApiResponse<Profile>>(`/admin/users/${id}/role`, { role }),
  toggleUserActive: (id: string) =>
    api.patch<ApiResponse<Profile>>(`/admin/users/${id}/toggle-active`),
  updateUser: (id: string, data: { username?: string; displayName?: string; bio?: string; role?: string }) =>
    api.patch<ApiResponse<Profile>>(`/admin/users/${id}`, data),
  deleteUser: (id: string) =>
    api.delete<ApiResponse<null>>(`/admin/users/${id}`),

  // Products
  getProducts: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Product>>('/admin/products', { params }),
  createProduct: (data: { name: string; slug: string; shortDescription?: string; description?: string; thumbnailUrl?: string; price?: number; discountPercent?: number; isFree?: boolean; ageRating?: string; developerId?: string }) =>
    api.post<ApiResponse<Product>>('/admin/products', data),
  updateProduct: (id: string, data: { name?: string; slug?: string; shortDescription?: string; description?: string; thumbnailUrl?: string; price?: number; discountPercent?: number; isFree?: boolean; is_active?: boolean; is_featured?: boolean; ageRating?: string }) =>
    api.patch<ApiResponse<Product>>(`/admin/products/${id}`, data),
  updateProductStatus: (id: string, isActive: boolean) =>
    api.patch<ApiResponse<Product>>(`/admin/products/${id}/status`, { isActive }),
  deleteProduct: (id: string) =>
    api.delete<ApiResponse<null>>(`/admin/products/${id}`),

  // Orders
  getOrders: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Order>>('/admin/orders', { params }),
  getOrderDetail: (id: string) =>
    api.get<ApiResponse<Order>>(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string) =>
    api.patch<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status }),
};
