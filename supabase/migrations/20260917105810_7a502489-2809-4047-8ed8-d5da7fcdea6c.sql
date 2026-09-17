ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_amount numeric,
  ADD COLUMN IF NOT EXISTS cashback_credited_at timestamptz,
  ADD COLUMN IF NOT EXISTS cashback_amount numeric;

CREATE OR REPLACE FUNCTION public.order_apply_cashback(_order_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
    PERFORM public.wallet_credit(
      _phone,
      _cashback,
      0,
      'Cashback — Order ' || _order.order_reference
    );
  END IF;

  RETURN _cashback;
END;
$$;

REVOKE ALL ON FUNCTION public.order_apply_cashback(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.order_apply_cashback(uuid) TO service_role;