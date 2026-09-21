CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  customer_name text NOT NULL,
  phone text,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review text NOT NULL,
  order_reference text
);
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages testimonials" ON public.testimonials FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();