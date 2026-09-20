ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (status = ANY (ARRAY['requested','picked_up','in_process','ready','delivered','cancelled']));
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS preferred_date date;