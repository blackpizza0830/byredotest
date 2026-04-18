-- Extend products schema for shop rendering and admin management.

alter table public.products
  add column if not exists category text not null default 'BODY',
  add column if not exists size text not null default 'One Size',
  add column if not exists image_url text not null default '/images/shop_1.png';

-- Backfill/seed products used by current shop page.
insert into public.products
  (name, slug, description, price, currency, stock_quantity, is_active, category, size, image_url)
values
  ('Blanche Hair Perfume', 'blanche-hair-perfume', 'Hair perfume with floral musk balance.', 85000, 'KRW', 40, true, 'HAIR PERFUME', '75 ml', '/images/shop_1.png'),
  ('Blanche Hand Cream', 'blanche-hand-cream', 'Hydrating cream with clean aldehydic signature.', 65000, 'KRW', 55, true, 'BODY', '30 ml', '/images/shop_2.png'),
  ('Blanche Hand Cleanser', 'blanche-hand-cleanser', 'Gentle hand cleanser with soft floral accord.', 55000, 'KRW', 60, true, 'BODY', '30 ml', '/images/shop_3.png'),
  ('Blanche Body Cream', 'blanche-body-cream', 'Rich body cream inspired by Blanche fragrance.', 120000, 'KRW', 35, true, 'BODY', '200 ml', '/images/shop_4.png'),
  ('Coin Laundry Candle', 'coin-laundry-candle', 'Scented candle with cotton and musk nuances.', 180000, 'KRW', 28, true, 'CANDLE', '240 g', '/images/shop_5.png'),
  ('BYR Sleep Set', 'byr-sleep-set', 'Loungewear set built for comfort and texture.', 450000, 'KRW', 16, true, 'READY-TO-WEAR', 'S / M / L', '/images/shop_6.png'),
  ('Blanche Travel Set', 'blanche-travel-set', 'Travel set with compact case and fragrance essentials.', 230000, 'KRW', 22, true, 'GIFT SET', '50 ml + Travel Case', '/images/shop_7.png'),
  ('Blanche Body Mist', 'blanche-body-mist', 'Body mist for daily layering and freshness.', 95000, 'KRW', 42, true, 'BODY', '150 ml', '/images/shop_8.png')
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  currency = excluded.currency,
  stock_quantity = excluded.stock_quantity,
  is_active = excluded.is_active,
  category = excluded.category,
  size = excluded.size,
  image_url = excluded.image_url,
  updated_at = timezone('utc', now());
