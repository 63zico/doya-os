create or replace function public.uuid_or_null(value text)
returns uuid
language plpgsql
immutable
as $$
begin
  return value::uuid;
exception
  when invalid_text_representation then
    return null;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('closing-photos', 'closing-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('inventory', 'inventory', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('datasets', 'datasets', false, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'application/json', 'text/plain']),
  ('avatars', 'avatars', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "closing_photos_read_store_scope"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'closing-photos'
  and (storage.foldername(name))[1] = 'stores'
  and public.can_access_store(public.uuid_or_null((storage.foldername(name))[2]))
);

create policy "closing_photos_insert_store_scope"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'closing-photos'
  and (storage.foldername(name))[1] = 'stores'
  and public.can_access_store(public.uuid_or_null((storage.foldername(name))[2]))
);

create policy "closing_photos_update_manager_scope"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'closing-photos'
  and (storage.foldername(name))[1] = 'stores'
  and public.can_manage_store(public.uuid_or_null((storage.foldername(name))[2]))
)
with check (
  bucket_id = 'closing-photos'
  and (storage.foldername(name))[1] = 'stores'
  and public.can_manage_store(public.uuid_or_null((storage.foldername(name))[2]))
);

create policy "inventory_files_read_store_scope"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'inventory'
  and (storage.foldername(name))[1] = 'stores'
  and public.can_access_store(public.uuid_or_null((storage.foldername(name))[2]))
);

create policy "inventory_files_write_store_scope"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'inventory'
  and (storage.foldername(name))[1] = 'stores'
  and public.can_access_store(public.uuid_or_null((storage.foldername(name))[2]))
);

create policy "datasets_read_owner_scope"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'datasets'
  and (storage.foldername(name))[1] = 'organizations'
  and public.has_org_role(public.uuid_or_null((storage.foldername(name))[2]), array['OWNER'])
);

create policy "datasets_write_owner_scope"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'datasets'
  and (storage.foldername(name))[1] = 'organizations'
  and public.has_org_role(public.uuid_or_null((storage.foldername(name))[2]), array['OWNER'])
);

create policy "avatars_read_authenticated"
on storage.objects
for select
to authenticated
using (bucket_id = 'avatars');

create policy "avatars_write_own_staff_folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = 'staff'
  and public.uuid_or_null((storage.foldername(name))[2]) = public.current_staff_id()
);

create policy "avatars_update_own_staff_folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = 'staff'
  and public.uuid_or_null((storage.foldername(name))[2]) = public.current_staff_id()
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = 'staff'
  and public.uuid_or_null((storage.foldername(name))[2]) = public.current_staff_id()
);
