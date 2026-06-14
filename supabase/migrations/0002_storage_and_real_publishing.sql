insert into storage.buckets (id, name, public)
values ('post-media', 'post-media', true)
on conflict (id) do update set public = excluded.public;

create policy "Public post media can be read"
on storage.objects
for select
using (bucket_id = 'post-media');

create policy "Post media can be uploaded by anon clients"
on storage.objects
for insert
with check (bucket_id = 'post-media');

create policy "Post media can be updated by anon clients"
on storage.objects
for update
using (bucket_id = 'post-media')
with check (bucket_id = 'post-media');

alter table social_accounts
add column if not exists instagram_business_account_id text,
add column if not exists meta_page_id text,
add column if not exists token_status text not null default 'not_connected';
