-- Add perks column to products table for product highlights
ALTER TABLE products ADD COLUMN IF NOT EXISTS perks jsonb DEFAULT '[]'::jsonb;