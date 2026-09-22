ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_at timestamp with time zone;
ALTER TABLE public.wallet_transactions ADD COLUMN IF NOT EXISTS order_reference text;

CREATE OR REPLACE FUNCTION public.wallet_pay_order(_phone text, _amount numeric, _reference text, _note text)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance numeric;
  v_order public.orders%ROWTYPE;
BEGIN
  IF _amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than zero';
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE order_reference = _reference FOR UPDATE;
  IF v_order.id IS NULL THEN
    RAISE EXCEPTION 'ORDER_NOT_FOUND';
  END IF;
  IF v_order.paid THEN
    RAISE EXCEPTION 'ORDER_ALREADY_PAID';
  END IF;

  SELECT balance INTO new_balance FROM public.wallet_balances WHERE phone = _phone FOR UPDATE;
  IF new_balance IS NULL OR new_balance < _amount THEN
    RAISE EXCEPTION 'INSUFFICIENT_BALANCE';
  END IF;

  new_balance := new_balance - _amount;
  UPDATE public.wallet_balances SET balance = new_balance, updated_at = now() WHERE phone = _phone;

  INSERT INTO public.wallet_transactions (phone, type, status, amount, bonus, resulting_balance, note, order_reference)
  VALUES (_phone, 'deduction', 'confirmed', _amount, 0, new_balance,
          COALESCE(NULLIF(_note, ''), 'Paid for order ' || _reference), _reference);

  UPDATE public.orders
     SET paid = true,
         paid_method = 'wallet',
         paid_at = now()
   WHERE id = v_order.id;

  RETURN new_balance;
END;
$$;

REVOKE ALL ON FUNCTION public.wallet_pay_order(text, numeric, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wallet_pay_order(text, numeric, text, text) TO service_role;