ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS pickup_photo_url text,
  ADD COLUMN IF NOT EXISTS delivery_photo_url text;