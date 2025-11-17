
-- Add category_cards column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_cards text[] DEFAULT '{}';

COMMENT ON COLUMN products.category_cards IS 'Selected category cards like Summer Sale, New Arrivals, etc.';
