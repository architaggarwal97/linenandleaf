CREATE SEQUENCE IF NOT EXISTS public.order_reference_seq START 1;

CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  customer_name text NOT NULL,
  whatsapp_number text NOT NULL,
  pickup_address text NOT NULL,
  preferred_window text,
  service_notes text,
  status text NOT NULL DEFAULT 'requested',
  paid boolean NOT NULL DEFAULT false,
  order_reference text NOT NULL UNIQUE DEFAULT 'LL-' || lpad(nextval('public.order_reference_seq')::text, 4, '0'),
  CONSTRAINT orders_status_check CHECK (status IN ('requested','picked_up','in_process','ready','delivered')),
  CONSTRAINT orders_preferred_window_check CHECK (preferred_window IS NULL OR preferred_window IN ('morning','afternoon','evening'))
);

GRANT ALL ON public.orders TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.order_reference_seq TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages orders" ON public.orders FOR ALL TO service_role USING (true) WITH CHECK (true);