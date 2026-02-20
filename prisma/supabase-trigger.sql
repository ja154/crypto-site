-- Run this in the Supabase SQL Editor after running `prisma migrate deploy`
-- This trigger auto-creates a public.users row and default wallets
-- whenever a new user signs up via Supabase Auth.
-- public.users.id is always set to auth.users.id to keep IDs in sync across schemas.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_user_id UUID;
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW() 
  )
  RETURNING id INTO new_user_id;

  -- Create default wallets
  INSERT INTO public.wallets (id, user_id, currency, balance, locked_balance, created_at, updated_at)
  VALUES
    (gen_random_uuid(), new_user_id, 'USDT', 1000.00000000, 0.00000000, NOW(), NOW()),
    (gen_random_uuid(), new_user_id, 'BTC',  0.00000000,    0.00000000, NOW(), NOW()),
    (gen_random_uuid(), new_user_id, 'ETH',  0.00000000,    0.00000000, NOW(), NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists before creating
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
