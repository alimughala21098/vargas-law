# Vargas Law Group platform (Next.js + Supabase + Vercel)

## 1. Supabase
1. Create a project. SQL Editor: paste and run `supabase/migrations/0001_core.sql`.
2. Authentication > Providers: keep Email on; turn OFF "Allow new users to sign up" (invite-only portal).
3. Create your first user in Authentication > Users, then run (replace the email):
```sql
insert into profiles(id,full_name) select id,'Admin' from auth.users where email='YOU@EXAMPLE.COM';
insert into user_roles(user_id,role) select id,'super_admin' from auth.users where email='YOU@EXAMPLE.COM';
```
## 2. Environment variables (Vercel > Settings > Environment Variables)
Copy everything from `.env.example`. Generate `PAYMENT_ENCRYPTION_KEY` with `openssl rand -base64 32`. Set `NEXT_PUBLIC_SITE_URL` to your live URL.
## 3. Deploy
Push to GitHub, import in Vercel (framework: Next.js), deploy. Local: `npm install && npm run dev`.
## 4. Payments (Stripe)
/admin/payment-gateways: save keys, Test connection, Activate. In Stripe add webhook `https://YOUR-DOMAIN/api/webhooks/payments/stripe` for `checkout.session.completed` and `checkout.session.expired`, and paste its signing secret.
