-- Fix function search path security issue
CREATE OR REPLACE FUNCTION format_phone_number()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;