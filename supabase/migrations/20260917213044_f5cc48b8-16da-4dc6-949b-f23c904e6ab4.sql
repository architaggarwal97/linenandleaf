ALTER TABLE public.wallet_transactions ADD COLUMN IF NOT EXISTS notified_at timestamptz;

CREATE OR REPLACE FUNCTION public.wallet_credit_typed(_phone text, _amount numeric, _bonus numeric, _note text, _type text)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  VALUES (_phone, _type, 'confirmed', _amount, _bonus, new_balance, _note);

  RETURN new_balance;
END;
$function$;

CREATE OR REPLACE FUNCTION public.order_apply_cashback(_order_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _order public.orders%ROWTYPE;
  _phone text;
  _cashback numeric := 0;
BEGIN
  SELECT * INTO _order FROM public.orders WHERE id = _order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'ORDER_NOT_FOUND';
  END IF;

  IF _order.cashback_credited_at IS NOT NULL THEN
    RETURN 0;
  END IF;

  IF _order.status <> 'delivered' OR _order.order_amount IS NULL THEN
    RETURN 0;
  END IF;

  IF _order.order_amount >= 1500 THEN
    _cashback := 200;
  ELSIF _order.order_amount >= 900 THEN
    _cashback := 100;
  ELSE
    _cashback := 0;
  END IF;

  _phone := right(regexp_replace(_order.whatsapp_number, '\D', '', 'g'), 10);
  IF length(_phone) <> 10 THEN
    RETURN 0;
  END IF;

  UPDATE public.orders
     SET cashback_credited_at = now(),
         cashback_amount = _cashback
   WHERE id = _order_id;

  IF _cashback > 0 THEN
    PERFORM public.wallet_credit_typed(
      _phone,
      _cashback,
      0,
      'Cashback — Order ' || _order.order_reference,
      'cashback'
    );
  END IF;

  RETURN _cashback;
END;
$function$;

CREATE OR REPLACE FUNCTION public.referral_complete(_referral_id uuid, _credit numeric DEFAULT 100)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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

  PERFORM public.wallet_credit_typed(_row.referred_phone, _credit, 0, 'Referral bonus', 'referral');
  PERFORM public.wallet_credit_typed(_row.referring_phone, _credit, 0, 'Referral bonus', 'referral');

  RETURN 'completed';
END;
$function$;