-- Promote a member to admin through an authenticated RPC call.
-- Only current admins can execute the promotion successfully.

create or replace function public.promote_admin_by_email(target_email text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_id uuid := auth.uid();
  target_profile_id uuid;
begin
  if caller_id is null or not public.is_admin(caller_id) then
    return 'forbidden';
  end if;

  select id
  into target_profile_id
  from public.profiles
  where lower(email) = lower(target_email)
  limit 1;

  if target_profile_id is null then
    return 'not_found';
  end if;

  update public.profiles
  set role = 'admin',
      updated_at = timezone('utc', now())
  where id = target_profile_id
    and role <> 'admin';

  if found then
    return 'promoted';
  end if;

  return 'already_admin';
end;
$$;

grant execute on function public.promote_admin_by_email(text) to authenticated;
