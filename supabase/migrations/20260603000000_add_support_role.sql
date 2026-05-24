-- Customer service / support role for intake-focused staff
do $$ begin
  alter type public.tenant_role add value if not exists 'support';
exception when duplicate_object then null;
end $$;
