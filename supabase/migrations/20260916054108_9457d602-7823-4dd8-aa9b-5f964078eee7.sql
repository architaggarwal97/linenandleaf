ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

GRANT SELECT (id, order_reference, status) ON public.orders TO anon;

CREATE POLICY "Anyone can view order status for tracking"
ON public.orders
FOR SELECT
TO anon
USING (true);