-- Restrict execution of internal trigger functions
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.decrement_stock() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- has_role must remain executable for RLS evaluation
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;