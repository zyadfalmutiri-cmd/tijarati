-- =============================================================================
-- تجارتي — Supabase / PostgreSQL schema
-- Free, unified business analytics platform. Enable RLS everywhere; every
-- table is scoped to auth.uid() via the organizations/org_members join.
-- =============================================================================

create extension if not exists "uuid-ossp";

-- ---------- Organizations & membership ----------
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz not null default now()
);

create table org_members (
  org_id uuid references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','admin','manager','staff')),
  primary key (org_id, user_id)
);

-- ---------- Branches ----------
create table branches (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  city text,
  lat double precision,
  lng double precision,
  manager text,
  status text not null default 'active' check (status in ('active','paused')),
  opened_at date default now(),
  created_at timestamptz not null default now()
);

-- ---------- Products & Inventory ----------
create table products (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  branch_id uuid references branches(id) on delete cascade,
  name text not null,
  sku text,
  category text,
  price numeric(12,2) not null default 0,
  cost numeric(12,2) not null default 0,
  stock integer not null default 0,
  reorder_level integer not null default 10,
  created_at timestamptz not null default now()
);

create table inventory_movements (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  branch_id uuid references branches(id) on delete cascade,
  change integer not null, -- positive = stock in, negative = stock out
  reason text,
  created_at timestamptz not null default now()
);

-- ---------- Orders & Refunds ----------
create table orders (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  branch_id uuid references branches(id) on delete cascade,
  customer_name text,
  total numeric(12,2) not null default 0,
  items_count integer not null default 1,
  status text not null default 'completed' check (status in ('completed','pending','refunded','cancelled')),
  channel text not null default 'in-store' check (channel in ('in-store','online','pos','marketplace')),
  source_connector text, -- e.g. 'shopify', 'stripe' — null when manual
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null default 0
);

create table refunds (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  branch_id uuid references branches(id) on delete cascade,
  amount numeric(12,2) not null,
  reason text,
  created_at timestamptz not null default now()
);

-- ---------- Expenses & Taxes ----------
create table expenses (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  branch_id uuid references branches(id) on delete cascade,
  category text not null check (category in ('rent','salaries','utilities','marketing','supplies','other')),
  amount numeric(12,2) not null,
  date date not null default now()
);

-- ---------- Employees ----------
create table employees (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  branch_id uuid references branches(id) on delete cascade,
  name text not null,
  role text,
  sales_total numeric(12,2) not null default 0,
  orders_handled integer not null default 0,
  attendance_rate numeric(5,2) not null default 100,
  productivity_score numeric(5,2) not null default 80,
  created_at timestamptz not null default now()
);

create table attendance_logs (
  id uuid primary key default uuid_generate_v4(),
  employee_id uuid references employees(id) on delete cascade not null,
  date date not null,
  status text not null check (status in ('present','absent','late','leave')),
  hours_worked numeric(5,2)
);

-- ---------- Notifications ----------
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  branch_id uuid references branches(id) on delete cascade,
  type text not null check (type in ('sales_up','sales_down','inventory_low','large_refund','system')),
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Integrations ----------
create table integration_connections (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  connector_id text not null, -- matches ConnectorDefinition.id in the app registry
  status text not null default 'not_connected' check (status in ('not_connected','connected','error','syncing')),
  account_label text,
  credentials jsonb, -- encrypted at rest via Supabase Vault in production
  connected_at timestamptz,
  last_sync_at timestamptz,
  last_error text,
  unique (org_id, connector_id)
);

create table integration_sync_logs (
  id uuid primary key default uuid_generate_v4(),
  connection_id uuid references integration_connections(id) on delete cascade not null,
  success boolean not null,
  orders_imported integer default 0,
  products_imported integer default 0,
  transactions_imported integer default 0,
  message text,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table organizations enable row level security;
alter table org_members enable row level security;
alter table branches enable row level security;
alter table products enable row level security;
alter table inventory_movements enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table refunds enable row level security;
alter table expenses enable row level security;
alter table employees enable row level security;
alter table attendance_logs enable row level security;
alter table notifications enable row level security;
alter table integration_connections enable row level security;
alter table integration_sync_logs enable row level security;

create or replace function is_org_member(target_org uuid)
returns boolean language sql security definer as $$
  select exists (select 1 from org_members where org_id = target_org and user_id = auth.uid());
$$;

create policy "org members can read their org" on organizations for select using (is_org_member(id));
create policy "org members can read branches" on branches for all using (is_org_member(org_id));
create policy "org members can read products" on products for all using (is_org_member(org_id));
create policy "org members can read orders" on orders for all using (is_org_member(org_id));
create policy "org members can read expenses" on expenses for all using (is_org_member(org_id));
create policy "org members can read employees" on employees for all using (is_org_member(org_id));
create policy "org members can read notifications" on notifications for all using (is_org_member(org_id));
create policy "org members can read integrations" on integration_connections for all using (is_org_member(org_id));

-- Indexes for dashboard aggregation performance
create index idx_orders_org_created on orders (org_id, created_at desc);
create index idx_orders_branch on orders (branch_id);
create index idx_products_org on products (org_id);
create index idx_notifications_org_read on notifications (org_id, read);
