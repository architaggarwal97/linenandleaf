CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referring_phone text NOT NULL,
  referred_phone text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT referrals_status_check CHECK (status IN ('pending', 'completed')),
  CONSTRAINT referrals_distinct_check CHECK (referring_phone <> referred_phone),
  CONSTRAINT referrals_referred_unique UNIQUE (referred_phone)
);

GRANT ALL ON public.referrals TO service_role;

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages referrals"
  ON public.referrals FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS referrals_referring_phone_idx ON public.referrals (referring_phone);

CREATE OR REPLACE FUNCTION public.referral_complete(_referral_id uuid, _credit numeric DEFAULT 100)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _row public.referrals%ROWTYPE;
BEGIN
  SELECT * INTO _row FROM public.referrals WHERE id = _referral_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'REFERRAL_NOT_FOUND';
  END IF;

  IF _row.status = 'completed' THEN
    RETURN 'already_completed';
  END IF;

  UPDATE public.referrals
     SET status = 'completed', completed_at = now()
   WHERE id = _referral_id;

  PERFORM public.wallet_credit(_row.referred_phone, _credit, 0, 'Referral bonus');
  PERFORM public.wallet_credit(_row.referring_phone, _credit, 0, 'Referral bonus');

  RETURN 'completed';
END;
$$;

REVOKE ALL ON FUNCTION public.referral_complete(uuid, numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.referral_complete(uuid, numeric) TO service_role;