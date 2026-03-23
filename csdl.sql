-- ============================================================
-- App Distribution Website - PostgreSQL Database Schema
-- Platform: Supabase (PostgreSQL)
-- Description: Database cho website phân phối phần mềm
--              tương tự Steam / Epic Games Store
-- Ghi chú:    Chạy trong Supabase SQL Editor (Dashboard > SQL Editor)
--             Auth do Supabase quản lý (auth.users)
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role         AS ENUM ('admin', 'user', 'developer');
CREATE TYPE order_status      AS ENUM ('pending', 'completed', 'cancelled', 'refunded');
CREATE TYPE payment_status    AS ENUM ('unpaid', 'paid', 'failed', 'refunded');
CREATE TYPE payment_method    AS ENUM ('credit_card', 'paypal', 'bank_transfer', 'wallet', 'other');
CREATE TYPE discount_type     AS ENUM ('percentage', 'fixed');
CREATE TYPE platform_type     AS ENUM ('windows', 'macos', 'linux', 'android', 'ios');
CREATE TYPE media_type        AS ENUM ('screenshot', 'trailer', 'video');
CREATE TYPE refund_status     AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE notification_type AS ENUM ('order', 'review', 'system', 'promotion', 'new_version');
CREATE TYPE age_rating        AS ENUM ('everyone', 'teen', 'mature', 'adult');

-- ============================================================
-- PROFILES (liên kết với auth.users của Supabase)
-- Mật khẩu & email verification do Supabase Auth xử lý
-- ============================================================

CREATE TABLE profiles (
    -- id phải trùng với auth.users.id
    id             UUID          PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username       TEXT          UNIQUE NOT NULL,
    avatar_url     TEXT,
    role           user_role     NOT NULL DEFAULT 'user',
    is_active      BOOLEAN       NOT NULL DEFAULT TRUE,
    wallet_balance NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (wallet_balance >= 0),
    last_login_at  TIMESTAMP,
    created_at     TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DEVELOPERS
-- ============================================================

CREATE TABLE developers (
    id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID    REFERENCES profiles(id) ON DELETE SET NULL,
    name        TEXT    NOT NULL,
    slug        TEXT    NOT NULL UNIQUE,
    description TEXT,
    logo_url    TEXT,
    website     TEXT,
    country     TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CATEGORIES (hỗ trợ phân cấp cha - con)
-- ============================================================

CREATE TABLE categories (
    id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id   UUID    REFERENCES categories(id) ON DELETE SET NULL,
    name        TEXT    NOT NULL UNIQUE,
    slug        TEXT    NOT NULL UNIQUE,
    description TEXT,
    icon_url    TEXT,
    sort_order  INT     NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TAGS
-- ============================================================

CREATE TABLE tags (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

-- ============================================================
-- PRODUCTS
-- ============================================================

CREATE TABLE products (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id      UUID        REFERENCES developers(id) ON DELETE SET NULL,
    name              TEXT        NOT NULL,
    slug              TEXT        NOT NULL UNIQUE,
    short_description TEXT,
    description       TEXT,
    thumbnail_url     TEXT,
    price             NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
    discount_percent  NUMERIC(5,2)  NOT NULL DEFAULT 0 CHECK (discount_percent BETWEEN 0 AND 100),
    is_free           BOOLEAN     NOT NULL DEFAULT FALSE,
    is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
    is_featured       BOOLEAN     NOT NULL DEFAULT FALSE,
    age_rating        age_rating  NOT NULL DEFAULT 'everyone',
    release_date      DATE,
    created_at        TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PRODUCT - CATEGORIES (nhiều - nhiều)
-- ============================================================

CREATE TABLE product_categories (
    product_id  UUID NOT NULL REFERENCES products(id)   ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- ============================================================
-- PRODUCT - TAGS (nhiều - nhiều)
-- ============================================================

CREATE TABLE product_tags (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag_id     UUID NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);

-- ============================================================
-- PRODUCT PLATFORMS & CẤU HÌNH HỆ THỐNG
-- ============================================================

CREATE TABLE product_platforms (
    id                      UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id              UUID          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    platform                platform_type NOT NULL,
    min_os                  TEXT,
    min_processor           TEXT,
    min_memory_mb           INT,
    min_storage_mb          INT,
    min_graphics            TEXT,
    recommended_os          TEXT,
    recommended_processor   TEXT,
    recommended_memory_mb   INT,
    recommended_storage_mb  INT,
    recommended_graphics    TEXT,
    UNIQUE (product_id, platform)
);

-- ============================================================
-- PRODUCT MEDIA (ảnh, trailer, video)
-- ============================================================

CREATE TABLE product_media (
    id          UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id  UUID       NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    media_type  media_type NOT NULL DEFAULT 'screenshot',
    url         TEXT       NOT NULL,
    caption     TEXT,
    sort_order  INT        NOT NULL DEFAULT 0
);

-- ============================================================
-- PRODUCT VERSIONS (lịch sử phiên bản)
-- ============================================================

CREATE TABLE product_versions (
    id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id   UUID    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    version      TEXT    NOT NULL,
    changelog    TEXT,
    download_url TEXT,
    file_size    BIGINT,
    is_latest    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (product_id, version)
);

-- ============================================================
-- COUPONS / MÃ GIẢM GIÁ
-- ============================================================

CREATE TABLE coupons (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    code            TEXT          NOT NULL UNIQUE,
    description     TEXT,
    discount_type   discount_type NOT NULL DEFAULT 'percentage',
    discount_value  NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
    min_order_value NUMERIC(10,2) NOT NULL DEFAULT 0,
    max_discount    NUMERIC(10,2),
    max_uses        INT,
    used_count      INT           NOT NULL DEFAULT 0,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    valid_from      TIMESTAMP     NOT NULL DEFAULT NOW(),
    valid_until     TIMESTAMP,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- GIỎ HÀNG
-- ============================================================

CREATE TABLE cart (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- ============================================================
-- ORDERS (đơn hàng)
-- ============================================================

CREATE TABLE orders (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID           NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    coupon_id       UUID           REFERENCES coupons(id)           ON DELETE SET NULL,
    subtotal        NUMERIC(12,2)  NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12,2)  NOT NULL DEFAULT 0,
    total_price     NUMERIC(12,2)  NOT NULL DEFAULT 0,
    status          order_status   NOT NULL DEFAULT 'pending',
    payment_method  payment_method,
    payment_status  payment_status NOT NULL DEFAULT 'unpaid',
    notes           TEXT,
    created_at      TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ORDER ITEMS (chi tiết đơn hàng)
-- ============================================================

CREATE TABLE order_items (
    id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id         UUID          NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
    product_id       UUID          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_name     TEXT          NOT NULL,
    unit_price       NUMERIC(10,2) NOT NULL,
    discount_percent NUMERIC(5,2)  NOT NULL DEFAULT 0,
    final_price      NUMERIC(10,2) NOT NULL
);

-- ============================================================
-- PAYMENTS (giao dịch thanh toán)
-- ============================================================

CREATE TABLE payments (
    id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id         UUID           NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    gateway          TEXT           NOT NULL,
    amount           NUMERIC(12,2)  NOT NULL,
    currency         CHAR(3)        NOT NULL DEFAULT 'USD',
    status           payment_status NOT NULL DEFAULT 'unpaid',
    transaction_id   TEXT,
    gateway_response JSONB,
    paid_at          TIMESTAMP,
    created_at       TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USER LIBRARY (thư viện phần mềm đã sở hữu)
-- ============================================================

CREATE TABLE user_library (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES profiles(id)    ON DELETE CASCADE,
    product_id    UUID NOT NULL REFERENCES products(id)    ON DELETE CASCADE,
    order_item_id UUID REFERENCES order_items(id)          ON DELETE SET NULL,
    license_key   TEXT,
    acquired_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- ============================================================
-- REVIEWS (đánh giá sản phẩm)
-- ============================================================

CREATE TABLE reviews (
    id            UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID     NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id    UUID     NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating        SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title         TEXT,
    comment       TEXT,
    is_approved   BOOLEAN  NOT NULL DEFAULT TRUE,
    helpful_count INT      NOT NULL DEFAULT 0,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- ============================================================
-- REVIEW VOTES (bình chọn đánh giá có hữu ích không)
-- ============================================================

CREATE TABLE review_votes (
    id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id  UUID    NOT NULL REFERENCES reviews(id)  ON DELETE CASCADE,
    user_id    UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (review_id, user_id)
);

-- ============================================================
-- WISHLISTS (danh sách yêu thích)
-- ============================================================

CREATE TABLE wishlists (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- ============================================================
-- NOTIFICATIONS (thông báo)
-- ============================================================

CREATE TABLE notifications (
    id         UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID              NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type       notification_type NOT NULL DEFAULT 'system',
    title      TEXT              NOT NULL,
    message    TEXT              NOT NULL,
    link_url   TEXT,
    is_read    BOOLEAN           NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP         NOT NULL DEFAULT NOW()
);

-- ============================================================
-- REFUNDS (yêu cầu hoàn tiền)
-- ============================================================

CREATE TABLE refunds (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID          NOT NULL REFERENCES order_items(id)  ON DELETE CASCADE,
    user_id       UUID          NOT NULL REFERENCES profiles(id)     ON DELETE CASCADE,
    reason        TEXT          NOT NULL,
    status        refund_status NOT NULL DEFAULT 'pending',
    admin_notes   TEXT,
    requested_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    processed_at  TIMESTAMP
);

-- ============================================================
-- DOWNLOAD HISTORY (lịch sử tải xuống)
-- ============================================================

CREATE TABLE download_history (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES profiles(id)           ON DELETE CASCADE,
    product_id    UUID NOT NULL REFERENCES products(id)           ON DELETE CASCADE,
    version_id    UUID          REFERENCES product_versions(id)   ON DELETE SET NULL,
    ip_address    INET,
    downloaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- BANNERS / QUẢNG CÁO TRANG CHỦ
-- ============================================================

CREATE TABLE banners (
    id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT    NOT NULL,
    image_url   TEXT    NOT NULL,
    link_url    TEXT,
    sort_order  INT     NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from  TIMESTAMP,
    valid_until TIMESTAMP,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- NEWS / TIN TỨC
-- ============================================================

CREATE TABLE news (
    id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id    UUID    REFERENCES profiles(id) ON DELETE SET NULL,
    product_id   UUID    REFERENCES products(id) ON DELETE SET NULL,
    title        TEXT    NOT NULL,
    slug         TEXT    NOT NULL UNIQUE,
    excerpt      TEXT,
    content      TEXT    NOT NULL,
    cover_image  TEXT,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Profiles
CREATE INDEX idx_profiles_role          ON profiles(role);

-- Developers
CREATE INDEX idx_developers_slug        ON developers(slug);

-- Categories
CREATE INDEX idx_categories_slug        ON categories(slug);
CREATE INDEX idx_categories_parent      ON categories(parent_id);

-- Products
CREATE INDEX idx_products_developer     ON products(developer_id);
CREATE INDEX idx_products_slug          ON products(slug);
CREATE INDEX idx_products_is_active     ON products(is_active);
CREATE INDEX idx_products_is_featured   ON products(is_featured);
CREATE INDEX idx_products_release_date  ON products(release_date);

-- Product relations
CREATE INDEX idx_product_categories_cat ON product_categories(category_id);
CREATE INDEX idx_product_tags_tag       ON product_tags(tag_id);
CREATE INDEX idx_product_media_product  ON product_media(product_id);
CREATE INDEX idx_product_versions_prod  ON product_versions(product_id);

-- Orders
CREATE INDEX idx_orders_user            ON orders(user_id);
CREATE INDEX idx_orders_status          ON orders(status);
CREATE INDEX idx_orders_created         ON orders(created_at);
CREATE INDEX idx_order_items_order      ON order_items(order_id);
CREATE INDEX idx_order_items_product    ON order_items(product_id);

-- Payments
CREATE INDEX idx_payments_order         ON payments(order_id);

-- Reviews
CREATE INDEX idx_reviews_product        ON reviews(product_id);
CREATE INDEX idx_reviews_user           ON reviews(user_id);

-- User library / wishlist / cart
CREATE INDEX idx_user_library_user      ON user_library(user_id);
CREATE INDEX idx_wishlists_user         ON wishlists(user_id);
CREATE INDEX idx_cart_user              ON cart(user_id);
CREATE INDEX idx_notifications_user     ON notifications(user_id);
CREATE INDEX idx_notifications_unread   ON notifications(user_id, is_read);
CREATE INDEX idx_download_user          ON download_history(user_id);
CREATE INDEX idx_download_product       ON download_history(product_id);
CREATE INDEX idx_news_slug              ON news(slug);
CREATE INDEX idx_news_published         ON news(is_published, published_at);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION fn_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_developers_updated_at
    BEFORE UPDATE ON developers
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- Đảm bảo chỉ có 1 version là latest cho mỗi sản phẩm
CREATE OR REPLACE FUNCTION fn_ensure_single_latest_version()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_latest = TRUE THEN
        UPDATE product_versions
        SET    is_latest = FALSE
        WHERE  product_id = NEW.product_id
          AND  id <> NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_single_latest_version
    BEFORE INSERT OR UPDATE ON product_versions
    FOR EACH ROW EXECUTE FUNCTION fn_ensure_single_latest_version();

-- Cập nhật helpful_count khi có vote mới
CREATE OR REPLACE FUNCTION fn_update_review_helpful_count()
RETURNS TRIGGER AS $$
DECLARE
    v_review_id UUID;
BEGIN
    v_review_id := COALESCE(NEW.review_id, OLD.review_id);
    UPDATE reviews
    SET    helpful_count = (
               SELECT COUNT(*) FROM review_votes
               WHERE  review_id = v_review_id AND is_helpful = TRUE
           )
    WHERE  id = v_review_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_helpful_count
    AFTER INSERT OR UPDATE OR DELETE ON review_votes
    FOR EACH ROW EXECUTE FUNCTION fn_update_review_helpful_count();

-- Tăng used_count của coupon khi đơn hàng hoàn thành
CREATE OR REPLACE FUNCTION fn_increment_coupon_used()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status <> 'completed'
       AND NEW.coupon_id IS NOT NULL THEN
        UPDATE coupons
        SET    used_count = used_count + 1
        WHERE  id = NEW.coupon_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_coupon_used
    AFTER UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION fn_increment_coupon_used();

-- ============================================================
-- VIEWS
-- ============================================================

-- Tổng hợp thông tin sản phẩm (giá sau giảm, rating, số lượng sở hữu)
CREATE VIEW vw_product_summary AS
SELECT
    p.id,
    p.name,
    p.slug,
    p.thumbnail_url,
    p.price,
    p.discount_percent,
    CASE WHEN p.discount_percent > 0
        THEN ROUND(p.price * (1 - p.discount_percent / 100.0), 2)
        ELSE p.price
    END                             AS final_price,
    p.is_free,
    p.is_active,
    p.is_featured,
    p.age_rating,
    p.release_date,
    d.name                          AS developer_name,
    d.slug                          AS developer_slug,
    ROUND(AVG(r.rating), 1)         AS avg_rating,
    COUNT(DISTINCT r.id)            AS review_count,
    COUNT(DISTINCT ul.id)           AS owner_count
FROM products p
LEFT JOIN developers   d  ON p.developer_id = d.id
LEFT JOIN reviews      r  ON r.product_id = p.id AND r.is_approved = TRUE
LEFT JOIN user_library ul ON ul.product_id = p.id
GROUP BY p.id, d.id;

-- Tổng hợp đơn hàng
CREATE VIEW vw_order_summary AS
SELECT
    o.id,
    o.user_id,
    p.username,
    (SELECT email FROM auth.users WHERE id = o.user_id) AS email,
    o.subtotal,
    o.discount_amount,
    o.total_price,
    o.status,
    o.payment_status,
    o.payment_method,
    o.created_at,
    COUNT(oi.id) AS item_count
FROM orders o
JOIN profiles      p  ON o.user_id = p.id
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, p.id;

-- ============================================================
-- SUPABASE: TỰ ĐỘNG TẠO PROFILE KHI ĐĂNG KÝ
-- Trigger chạy trên auth.users khi user mới đăng ký
-- ============================================================

CREATE OR REPLACE FUNCTION public.fn_create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            split_part(NEW.email, '@', 1)
        )
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_create_profile_on_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.fn_create_profile_on_signup();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Bắt buộc bật để bảo vệ dữ liệu khi dùng Supabase REST API
-- ============================================================

-- Helper: kiểm tra user hiện tại có phải admin không
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Bật RLS cho tất cả bảng
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE developers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags              ENABLE ROW LEVEL SECURITY;
ALTER TABLE products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags      ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media     ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_versions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart              ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_library      ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds           ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_history  ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners           ENABLE ROW LEVEL SECURITY;
ALTER TABLE news              ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------
CREATE POLICY "profiles: public read"
    ON profiles FOR SELECT USING (TRUE);

CREATE POLICY "profiles: own update"
    ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles: admin all"
    ON profiles FOR ALL USING (is_admin());

-- ------------------------------------------------------------
-- DEVELOPERS
-- ------------------------------------------------------------
CREATE POLICY "developers: public read"
    ON developers FOR SELECT USING (TRUE);

CREATE POLICY "developers: own insert"
    ON developers FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "developers: own update"
    ON developers FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "developers: admin all"
    ON developers FOR ALL USING (is_admin());

-- ------------------------------------------------------------
-- CATEGORIES & TAGS (public read, admin write)
-- ------------------------------------------------------------
CREATE POLICY "categories: public read" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "categories: admin all"   ON categories FOR ALL   USING (is_admin());

CREATE POLICY "tags: public read"       ON tags FOR SELECT USING (TRUE);
CREATE POLICY "tags: admin all"         ON tags FOR ALL   USING (is_admin());

-- ------------------------------------------------------------
-- PRODUCTS
-- ------------------------------------------------------------
CREATE POLICY "products: public read"
    ON products FOR SELECT USING (is_active = TRUE OR is_admin());

CREATE POLICY "products: developer insert"
    ON products FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM developers WHERE id = developer_id AND user_id = auth.uid())
    );

CREATE POLICY "products: developer update"
    ON products FOR UPDATE USING (
        EXISTS (SELECT 1 FROM developers WHERE id = developer_id AND user_id = auth.uid())
    );

CREATE POLICY "products: admin all"
    ON products FOR ALL USING (is_admin());

-- product sub-tables: developer của sản phẩm hoặc admin có thể ghi
CREATE POLICY "product_categories: public read"  ON product_categories FOR SELECT USING (TRUE);
CREATE POLICY "product_categories: admin all"    ON product_categories FOR ALL   USING (is_admin());

CREATE POLICY "product_tags: public read"        ON product_tags FOR SELECT USING (TRUE);
CREATE POLICY "product_tags: admin all"          ON product_tags FOR ALL   USING (is_admin());

CREATE POLICY "product_platforms: public read"   ON product_platforms FOR SELECT USING (TRUE);
CREATE POLICY "product_platforms: admin all"     ON product_platforms FOR ALL   USING (is_admin());

CREATE POLICY "product_media: public read"       ON product_media FOR SELECT USING (TRUE);
CREATE POLICY "product_media: admin all"         ON product_media FOR ALL   USING (is_admin());

CREATE POLICY "product_versions: public read"    ON product_versions FOR SELECT USING (TRUE);
CREATE POLICY "product_versions: admin all"      ON product_versions FOR ALL   USING (is_admin());

-- ------------------------------------------------------------
-- COUPONS
-- ------------------------------------------------------------
CREATE POLICY "coupons: auth read active"
    ON coupons FOR SELECT USING (is_active = TRUE AND auth.uid() IS NOT NULL);

CREATE POLICY "coupons: admin all"
    ON coupons FOR ALL USING (is_admin());

-- ------------------------------------------------------------
-- CART
-- ------------------------------------------------------------
CREATE POLICY "cart: own all"
    ON cart FOR ALL USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- ORDERS
-- ------------------------------------------------------------
CREATE POLICY "orders: own read"
    ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders: own insert"
    ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders: admin all"
    ON orders FOR ALL USING (is_admin());

-- ------------------------------------------------------------
-- ORDER ITEMS
-- ------------------------------------------------------------
CREATE POLICY "order_items: own read"
    ON order_items FOR SELECT USING (
        EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
    );

CREATE POLICY "order_items: own insert"
    ON order_items FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
    );

CREATE POLICY "order_items: admin all"
    ON order_items FOR ALL USING (is_admin());

-- ------------------------------------------------------------
-- PAYMENTS
-- ------------------------------------------------------------
CREATE POLICY "payments: own read"
    ON payments FOR SELECT USING (
        EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
    );

CREATE POLICY "payments: admin all"
    ON payments FOR ALL USING (is_admin());

-- ------------------------------------------------------------
-- USER LIBRARY
-- ------------------------------------------------------------
CREATE POLICY "user_library: own read"
    ON user_library FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_library: admin all"
    ON user_library FOR ALL USING (is_admin());

-- ------------------------------------------------------------
-- REVIEWS
-- ------------------------------------------------------------
CREATE POLICY "reviews: public read approved"
    ON reviews FOR SELECT USING (is_approved = TRUE OR auth.uid() = user_id);

CREATE POLICY "reviews: own insert"
    ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews: own update"
    ON reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reviews: admin all"
    ON reviews FOR ALL USING (is_admin());

-- ------------------------------------------------------------
-- REVIEW VOTES
-- ------------------------------------------------------------
CREATE POLICY "review_votes: public read"
    ON review_votes FOR SELECT USING (TRUE);

CREATE POLICY "review_votes: own insert"
    ON review_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "review_votes: own update"
    ON review_votes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "review_votes: own delete"
    ON review_votes FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- WISHLISTS
-- ------------------------------------------------------------
CREATE POLICY "wishlists: own all"
    ON wishlists FOR ALL USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- NOTIFICATIONS
-- ------------------------------------------------------------
CREATE POLICY "notifications: own read"
    ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications: own update"
    ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications: admin all"
    ON notifications FOR ALL USING (is_admin());

-- ------------------------------------------------------------
-- REFUNDS
-- ------------------------------------------------------------
CREATE POLICY "refunds: own read"
    ON refunds FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "refunds: own insert"
    ON refunds FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "refunds: admin all"
    ON refunds FOR ALL USING (is_admin());

-- ------------------------------------------------------------
-- DOWNLOAD HISTORY
-- ------------------------------------------------------------
CREATE POLICY "download_history: own read"
    ON download_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "download_history: own insert"
    ON download_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "download_history: admin all"
    ON download_history FOR ALL USING (is_admin());

-- ------------------------------------------------------------
-- BANNERS (public read nếu đang active)
-- ------------------------------------------------------------
CREATE POLICY "banners: public read"
    ON banners FOR SELECT USING (
        is_active = TRUE
        AND (valid_from  IS NULL OR valid_from  <= NOW())
        AND (valid_until IS NULL OR valid_until >= NOW())
        OR is_admin()
    );

CREATE POLICY "banners: admin all"
    ON banners FOR ALL USING (is_admin());

-- ------------------------------------------------------------
-- NEWS
-- ------------------------------------------------------------
CREATE POLICY "news: public read published"
    ON news FOR SELECT USING (is_published = TRUE OR is_admin());

CREATE POLICY "news: admin all"
    ON news FOR ALL USING (is_admin());