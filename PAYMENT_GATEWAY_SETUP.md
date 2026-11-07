# Payment gateway setup
1. Set `PAYMENT_ENCRYPTION_KEY` (openssl rand -base64 32) in Vercel. Credentials are AES-256-GCM encrypted before storage and never sent to the browser.
2. /admin/payment-gateways > Add credentials (Test first) > Test connection > Activate. Going live asks for confirmation.
3. In Stripe add a webhook to `https://YOUR-DOMAIN/api/webhooks/payments/stripe` for `checkout.session.completed` and `checkout.session.expired`; paste its signing secret in the form. Payment status only changes from verified webhooks, never from the browser redirect.
## Adding another provider
Create `src/lib/payments/adapters/<name>.ts` implementing `PaymentGatewayAdapter` (see `types.ts` and `stripe.ts`), register it in `registry.ts`. Invoices, portal, transactions and reports need no changes.
## Not implemented yet
Refund API calls, payment plans, booking-time payments, manual webhook reprocessing.
