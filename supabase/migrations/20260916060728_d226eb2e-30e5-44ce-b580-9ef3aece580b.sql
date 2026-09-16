CREATE TABLE public.wallet_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  customer_name text NOT NULL DEFAULT '',
  whatsapp_number text NOT NULL,
  entry_type text NOT NULL DEFAULT 'topup' CHECK (entry_type IN ('topup','spend','adjustment')),
  amount numeric(10,2) NOT NULL DEFAULT 0,
  bonus numeric(10,2) NOT NULL DEFAULT 0,
  note text
);

CREATE INDEX wallet_entries_number_idx ON public.wallet_entries (whatsapp_number);

GRANT ALL ON public.wallet_entries TO service_role;

ALTER TABLE public.wallet_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages wallet entries"
ON public.wallet_entries FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_wallet_entries_updated_at
BEFORE UPDATE ON public.wallet_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();