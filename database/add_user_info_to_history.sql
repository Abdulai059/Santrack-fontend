-- Add user_name and user_role to location_history table
-- This allows us to track who was where, even for historical data

ALTER TABLE public.location_history 
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_role TEXT;

-- Create index for faster queries by user_name
CREATE INDEX IF NOT EXISTS idx_location_history_user_name ON public.location_history(user_name);

-- Update the trigger function to include user_name and user_role
CREATE OR REPLACE FUNCTION save_location_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into history table with user info
  INSERT INTO public.location_history (
    user_id,
    user_name,
    user_role,
    latitude,
    longitude,
    accuracy,
    heading,
    speed,
    timestamp
  ) VALUES (
    NEW.user_id,
    NEW.user_name,
    NEW.user_role,
    NEW.latitude,
    NEW.longitude,
    NEW.accuracy,
    NEW.heading,
    NEW.speed,
    NEW.timestamp
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Location history table updated successfully!';
  RAISE NOTICE 'Added columns: user_name, user_role';
  RAISE NOTICE 'Updated trigger to save user information';
END $$;
