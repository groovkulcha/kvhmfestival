create table if not exists public.vip_orders (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text unique,
  customer_email text,
  customer_name text,
  quantity integer not null default 1 check (quantity between 1 and 10),
  amount_total integer not null check (amount_total = 2100),
  currency text not null default 'usd' check (currency = 'usd'),
  status text not null default 'pending' check (status in ('pending', 'paid', 'expired', 'refunded')),
  access_code text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  checked_in_at timestamptz,
  checked_in_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vip_orders enable row level security;

create or replace function public.set_vip_orders_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists vip_orders_set_updated_at on public.vip_orders;
create trigger vip_orders_set_updated_at
before update on public.vip_orders
for each row execute function public.set_vip_orders_updated_at();

revoke all on table public.vip_orders from anon, authenticated;
