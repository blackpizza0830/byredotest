-- Optional seed data for local development.
-- This file runs when `npm run supabase:reset` is executed.

insert into public.products (name, slug, description, price, currency, stock_quantity, is_active)
values
  ('Mojave Ghost', 'mojave-ghost', 'Woody composition with ambrette and sandalwood.', 285000, 'KRW', 30, true),
  ('Blanche', 'blanche', 'Aldehydic floral fragrance with clean musk notes.', 270000, 'KRW', 20, true),
  ('Bal d''Afrique', 'bal-dafrique', 'Warm vetiver fragrance inspired by Paris in the 1920s.', 295000, 'KRW', 25, true)
on conflict (slug) do nothing;
