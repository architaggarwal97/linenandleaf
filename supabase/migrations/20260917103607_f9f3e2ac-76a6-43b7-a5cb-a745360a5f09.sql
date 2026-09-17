CREATE TABLE public.wallet_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE,
  balance numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.wallet_balances TO service_role;
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages wallet balances" ON public.wallet_balances FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE TRIGGER update_wallet_balances_updated_at BEFORE UPDATE ON public.wallet_balances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  type text NOT NULL DEFAULT 'topup',
  status text NOT NULL DEFAULT 'confirmed',
  amount numeric NOT NULL DEFAULT 0,
  bonus numeric NOT NULL DEFAULT 0,
  resulting_balance numeric,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT wallet_transactions_type_check CHECK (type IN ('topup','deduction')),
  CONSTRAINT wallet_transactions_status_check CHECK (status IN ('pending','confirmed','cancelled'))
);
GRANT ALL ON public.wallet_transactions TO service_role;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages wallet transactions" ON public.wallet_transactions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX wallet_transactions_phone_idx ON public.wallet_transactions (phone, created_at DESC);
CREATE INDEX wallet_transactions_status_idx ON public.wallet_transactions (status, created_at DESC);

CREATE TABLE public.wallet_login_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.wallet_login_codes TO service_role;
ALTER TABLE public.wallet_login_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages wallet login codes" ON public.wallet_login_codes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX wallet_login_codes_phone_idx ON public.wallet_login_codes (phone, created_at DESC);

CREATE OR REPLACE FUNCTION public.wallet_credit(_phone text, _amount numeric, _bonus numeric, _note text)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance numeric;
BEGIN
  IF _amount < 0 OR _bonus < 0 THEN
    RAISE EXCEPTION 'Amounts must not be negative';
  END IF;

  INSERT INTO public.wallet_balances (phone, balance)
  VALUES (_phone, 0)
  ON CONFLICT (phone) DO NOTHING;

  SELECT balance INTO new_balance FROM public.wallet_balances WHERE phone = _phone FOR UPDATE;
  new_balance := new_balance + _amount + _bonus;

  UPDATE public.wallet_balances SET balance = new_balance WHERE phone = _phone;

  INSERT INTO public.wallet_transactions (phone, type, status, amount, bonus, resulting_balance, note)
  VALUES (_phone, 'topup', 'confirmed', _amount, _bonus, new_balance, _note);

  RETURN new_balance;
END;
$$;

CREATE OR REPLACE FUNCTION public.wallet_deduct(_phone text, _amount numeric, _note text)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance numeric;
BEGIN
  IF _amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than zero';
  END IF;

  SELECT balance INTO new_balance FROM public.wallet_balances WHERE phone = _phone FOR UPDATE;
  IF new_balance IS NULL THEN
    RAISE EXCEPTION 'INSUFFICIENT_BALANCE';
  END IF;
  IF new_balance < _amount THEN
    RAISE EXCEPTION 'INSUFFICIENT_BALANCE';
  END IF;

  new_balance := new_balance - _amount;
  UPDATE public.wallet_balances SET balance = new_balance WHERE phone = _phone;

  INSERT INTO public.wallet_transactions (phone, type, status, amount, bonus, resulting_balance, note)
  VALUES (_phone, 'deduction', 'confirmed', _amount, 0, new_balance, _note);

  RETURN new_balance;
END;
$$;

REVOKE ALL ON FUNCTION public.wallet_credit(text, numeric, numeric, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.wallet_deduct(text, numeric, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wallet_credit(text, numeric, numeric, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.wallet_deduct(text, numeric, text) TO service_role;