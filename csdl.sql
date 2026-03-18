create table users (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    username text unique,
    avatar_url text,
    created_at timestamp default now()
);

create table developers (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    website text,
    created_at timestamp default now()
);

create table categories (
    id uuid primary key default gen_random_uuid(),
    name text not null unique
);

create table products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    price numeric(10,2) default 0,
    developer_id uuid references developers(id) on delete set null,
    category_id uuid references categories(id) on delete set null,
    thumbnail text,
    release_date date,
    created_at timestamp default now()
);

create table product_versions (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade,
    version text not null,
    changelog text,
    download_url text,
    file_size bigint,
    created_at timestamp default now()
);

create table orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    total_price numeric(10,2),
    status text default 'pending',
    created_at timestamp default now()
);

create table order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references orders(id) on delete cascade,
    product_id uuid references products(id) on delete cascade,
    price numeric(10,2)
);


create table user_library (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    product_id uuid references products(id) on delete cascade,
    license_key text,
    purchase_date timestamp default now(),
    unique(user_id, product_id)
);

create table reviews (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    product_id uuid references products(id) on delete cascade,
    rating int check (rating between 1 and 5),
    comment text,
    created_at timestamp default now(),
    unique(user_id, product_id)
);

create table product_screenshots (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade,
    image_url text
);

create table wishlists (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    product_id uuid references products(id) on delete cascade,
    created_at timestamp default now(),
    unique(user_id, product_id)
);

create index idx_products_category on products(category_id);
create index idx_products_developer on products(developer_id);
create index idx_orders_user on orders(user_id);
create index idx_reviews_product on reviews(product_id);