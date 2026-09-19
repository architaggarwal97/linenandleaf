ALTER TABLE public.wallet_transactions DROP CONSTRAINT IF EXISTS wallet_transactions_type_check;
ALTER TABLE public.wallet_transactions ADD CONSTRAINT wallet_transactions_type_check CHECK (type = ANY (ARRAY['topup'::text, 'deduction'::text, 'cashback'::text, 'referral'::text]));

CREATE TABLE public.credit_failures (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  kind text NOT NULL DEFAULT 'cashback',
  order_id uuid,
  order_reference text,
  referral_id uuid,
  phone text,
  amount numeric,
  message text NOT NULL DEFAULT '',
  resolved_at timestamptz
);

GRANT ALL ON public.credit_failures TO service_role;
ALTER TABLE public.credit_failures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages credit failures" ON public.credit_failures FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TRIGGER update_credit_failures_updated_at BEFORE UPDATE ON public.credit_failures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();