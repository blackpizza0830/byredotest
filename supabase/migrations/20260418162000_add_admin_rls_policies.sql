-- Admin-specific RLS policies for dashboard access and management.

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = uid
      and role = 'admin'
  );
$$;

-- Profiles
drop policy if exists "profiles_admin_select_all" on public.profiles;
create policy "profiles_admin_select_all"
on public.profiles
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "profiles_admin_update_all" on public.profiles;
create policy "profiles_admin_update_all"
on public.profiles
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Products
drop policy if exists "products_admin_select_all" on public.products;
create policy "products_admin_select_all"
on public.products
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert"
on public.products
for insert
to authenticated
with check (public.is_admin(auth.uid()));

drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update"
on public.products
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "products_admin_delete" on public.products;
create policy "products_admin_delete"
on public.products
for delete
to authenticated
using (public.is_admin(auth.uid()));

-- Orders
drop policy if exists "orders_admin_select_all" on public.orders;
create policy "orders_admin_select_all"
on public.orders
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update"
on public.orders
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Order items
drop policy if exists "order_items_admin_select_all" on public.order_items;
create policy "order_items_admin_select_all"
on public.order_items
for select
to authenticated
using (public.is_admin(auth.uid()));

-- Payments
drop policy if exists "payments_admin_select_all" on public.payments;
create policy "payments_admin_select_all"
on public.payments
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "payments_admin_update" on public.payments;
create policy "payments_admin_update"
on public.payments
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
