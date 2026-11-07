# Vargas Law Group platform (Next.js + Supabase + Vercel)
Public website (EN/ES), client portal, attorney workspace and super admin, with Stripe payment gateway management.

## 1. Supabase
1. SQL Editor: run `supabase/migrations/0001_core.sql`, then `0002_features.sql` (creates tables, row-level security, private `documents` storage bucket).
2. Authentication > Sign In / Providers: keep Email on, turn OFF "Allow new users to sign up". Optionally enable MFA.
3. Authentication > URL Configuration: Site URL = your Vercel domain; add `https://YOUR-DOMAIN/portal/reset-password` to Redirect URLs.
4. Authentication > Users > Add user (your own email + password), then run in SQL Editor:
```sql
insert into profiles(id,full_name) select id,'Admin' from auth.users where email='YOU@EXAMPLE.COM';
insert into user_roles(user_id,role) select id,'super_admin' from auth.users where email='YOU@EXAMPLE.COM';
```
After that, invite everyone else from /admin/users.

## 2. Vercel environment variables
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (prefilled in `.env.example`), `SUPABASE_SERVICE_ROLE_KEY` (secret, from Supabase > API), `PAYMENT_ENCRYPTION_KEY` (`openssl rand -base64 32`), `NEXT_PUBLIC_SITE_URL` (your live URL).

## 3. Deploy
Push to GitHub, import in Vercel (Next.js preset). Local: `npm install && npm run dev`.

## 4. First checks
/ (home), /book-consultation (submit a test request), /portal/login, /admin, /admin/payment-gateways. Then follow `PAYMENT_GATEWAY_SETUP.md`.

## Where to edit things
Service and guide text: `src/lib/content.ts` (placeholder, needs attorney approval). Booking hours: `src/lib/slots.ts`. FAQs and team: /admin/faqs, /admin/team (only published items show).
