-- Keep auth.users and public.profiles in sync.
-- Promote the configured admin account on sign-up.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_role text := 'customer';
  incoming_full_name text;
begin
  if new.email = 'jinzzang774@gmail.com' then
    new_role := 'admin';
  end if;

  incoming_full_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '');

  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, incoming_full_name, new_role)
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    role = case
      when excluded.email = 'jinzzang774@gmail.com' then 'admin'
      else public.profiles.role
    end,
    updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- Backfill admin role if profile already exists for this email.
update public.profiles
set role = 'admin',
    updated_at = timezone('utc', now())
where email = 'jinzzang774@gmail.com';
