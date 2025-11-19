-- Add store_name column to seller_applications table
ALTER TABLE public.seller_applications 
ADD COLUMN IF NOT EXISTS store_name text;