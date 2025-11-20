-- Add phone verification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_verification_code TEXT,
ADD COLUMN IF NOT EXISTS phone_verification_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_phone_verified ON public.profiles(phone_verified);

-- Update existing phone numbers to ensure they start with +232
UPDATE public.profiles 
SET phone = CONCAT('+232', REGEXP_REPLACE(phone, '^0+', ''))
WHERE phone IS NOT NULL 
  AND phone != '' 
  AND NOT phone LIKE '+232%';

-- Function to format phone numbers automatically
CREATE OR REPLACE FUNCTION format_phone_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if phone is not null and not empty
  IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN
    -- Remove leading zeros and add +232 prefix if not already present
    IF NEW.phone NOT LIKE '+232%' THEN
      NEW.phone := '+232' || REGEXP_REPLACE(NEW.phone, '^0+', '');
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-format phone numbers on insert/update
DROP TRIGGER IF EXISTS format_phone_on_change ON public.profiles;
CREATE TRIGGER format_phone_on_change
  BEFORE INSERT OR UPDATE OF phone ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION format_phone_number();