-- Add additional PayPal fields to payments table
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS payer_email TEXT,
ADD COLUMN IF NOT EXISTS payer_id TEXT,
ADD COLUMN IF NOT EXISTS verified_with_paypal BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS paypal_verification_date TIMESTAMP WITH TIME ZONE;