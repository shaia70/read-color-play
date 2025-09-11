-- Insert a test payment for the user shelley3@gmail.com to verify the payment system
INSERT INTO public.payments (
  user_id,
  paypal_transaction_id,
  amount,
  currency,
  status
) VALUES (
  '82c10c97-7ff5-44bc-b5ab-6e98492f277d',
  'TEST_PAYMENT_' || extract(epoch from now())::text,
  70,
  'ILS',
  'success'
);