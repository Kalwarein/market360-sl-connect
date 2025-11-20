-- Add reference_number column to wallet_requests table
ALTER TABLE wallet_requests 
ADD COLUMN IF NOT EXISTS reference_number TEXT;