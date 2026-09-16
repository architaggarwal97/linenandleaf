ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS referred_by_phone text,
  ADD COLUMN IF NOT EXISTS referral_credited_at timestamptz;

CREATE INDEX IF NOT EXISTS orders_referred_by_phone_idx ON public.orders (referred_by_phone);