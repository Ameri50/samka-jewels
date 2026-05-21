  -- Roles enum
  create type public.app_role as enum ('admin', 'customer');

  -- Profiles
  create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    phone text,
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );
  alter table public.profiles enable row level security;

  -- User roles
  create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    role app_role not null,
    created_at timestamptz not null default now(),
    unique(user_id, role)
  );
  alter table public.user_roles enable row level security;

  -- Security definer role check
  create or replace function public.has_role(_user_id uuid, _role app_role)
  returns boolean
  language sql stable security definer set search_path = public
  as $$
    select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
  $$;

  -- Categories
  create table public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    image_url text,
    display_order int not null default 0,
    created_at timestamptz not null default now()
  );
  alter table public.categories enable row level security;

  -- Products
  create table public.products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    price numeric(10,2) not null check (price >= 0),
    stock int not null default 0 check (stock >= 0),
    low_stock_threshold int not null default 5,
    category_id uuid references public.categories(id) on delete set null,
    image_url text,
    gallery jsonb default '[]'::jsonb,
    featured boolean not null default false,
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );
  alter table public.products enable row level security;
  create index on public.products(category_id);
  create index on public.products(featured);

  -- Product attributes (material, acabado, etc.)
  create table public.product_attributes (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    attribute_type text not null,  -- "material", "acabado", "tamaño"
    value text not null,           -- "Plata 925", "Dorado mate"
    price_modifier numeric(10,2) not null default 0,
    created_at timestamptz not null default now()
  );
  alter table public.product_attributes enable row level security;
  create index on public.product_attributes(product_id);

  -- Orders
  create type public.order_status as enum ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled');
  create type public.payment_method as enum ('yape', 'plin');

  create table public.orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    order_number text not null unique default ('SMK-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
    full_name text not null,
    phone text not null,
    email text not null,
    address text not null,
    city text not null,
    notes text,
    subtotal numeric(10,2) not null,
    shipping numeric(10,2) not null default 0,
    total numeric(10,2) not null,
    status order_status not null default 'pending',
    payment_method payment_method not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );
  alter table public.orders enable row level security;
  create index on public.orders(user_id);
  create index on public.orders(status);

  -- Order items
  create table public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete set null,
    product_name text not null,
    product_image text,
    unit_price numeric(10,2) not null,
    quantity int not null check (quantity > 0),
    selected_attributes jsonb default '{}'::jsonb,
    subtotal numeric(10,2) not null,
    created_at timestamptz not null default now()
  );
  alter table public.order_items enable row level security;
  create index on public.order_items(order_id);

  -- ============ RLS POLICIES ============

  -- profiles
  create policy "Users view own profile" on public.profiles for select using (auth.uid() = id);
  create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
  create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
  create policy "Admins view all profiles" on public.profiles for select using (public.has_role(auth.uid(), 'admin'));

  -- user_roles
  create policy "Users view own roles" on public.user_roles for select using (auth.uid() = user_id);
  create policy "Admins manage roles" on public.user_roles for all using (public.has_role(auth.uid(), 'admin'));

  -- categories (públicas)
  create policy "Anyone views categories" on public.categories for select using (true);
  create policy "Admins manage categories" on public.categories for all using (public.has_role(auth.uid(), 'admin'));

  -- products
  create policy "Anyone views active products" on public.products for select using (active = true or public.has_role(auth.uid(), 'admin'));
  create policy "Admins manage products" on public.products for all using (public.has_role(auth.uid(), 'admin'));

  -- product_attributes
  create policy "Anyone views attributes" on public.product_attributes for select using (true);
  create policy "Admins manage attributes" on public.product_attributes for all using (public.has_role(auth.uid(), 'admin'));

  -- orders
  create policy "Users view own orders" on public.orders for select using (auth.uid() = user_id);
  create policy "Users create own orders" on public.orders for insert with check (auth.uid() = user_id);
  create policy "Admins view all orders" on public.orders for select using (public.has_role(auth.uid(), 'admin'));
  create policy "Admins update orders" on public.orders for update using (public.has_role(auth.uid(), 'admin'));

  -- order_items
  create policy "Users view own order items" on public.order_items for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
  create policy "Users create order items" on public.order_items for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
  create policy "Admins view all order items" on public.order_items for select using (public.has_role(auth.uid(), 'admin'));

  -- ============ TRIGGERS ============

  -- updated_at
  create or replace function public.set_updated_at()
  returns trigger language plpgsql as $$
  begin new.updated_at = now(); return new; end; $$;

  create trigger trg_profiles_updated before update on public.profiles
    for each row execute function public.set_updated_at();
  create trigger trg_products_updated before update on public.products
    for each row execute function public.set_updated_at();
  create trigger trg_orders_updated before update on public.orders
    for each row execute function public.set_updated_at();

  -- Auto crear perfil + rol customer al registrarse
  create or replace function public.handle_new_user()
  returns trigger language plpgsql security definer set search_path = public
  as $$
  begin
    insert into public.profiles (id, full_name)
    values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
    insert into public.user_roles (user_id, role) values (new.id, 'customer');
    return new;
  end; $$;

  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

  -- Descontar stock al crear order_item
  create or replace function public.decrement_stock()
  returns trigger language plpgsql security definer set search_path = public
  as $$
  begin
    update public.products set stock = greatest(0, stock - new.quantity)
    where id = new.product_id;
    return new;
  end; $$;

  create trigger trg_decrement_stock
    after insert on public.order_items
    for each row execute function public.decrement_stock();