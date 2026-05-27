ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.products.price IS 'Price in MMK (Myanmar Kyat)';
