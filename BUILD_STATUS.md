# BUILD_STATUS (v0.2, builds and typechecks cleanly)

## Working (needs your Supabase + env vars)
- Public: home (WebGL globe + reduced-motion fallback), services index + 7 service pages, contact, consultation request form (saved to DB)
- Auth: invite-only email/password login, middleware gate on /portal, /workspace, /admin
- Portal: my cases, invoices, Pay now (Stripe Checkout)
- Workspace: 10-stage case pipeline (RLS-scoped)
- Admin: overview counts; Payment gateways (encrypted credentials, real Stripe connection test, test/live separation, live-mode confirmation, activate/disable, transaction list, audit log)
- Webhook: signature-verified, idempotent, updates transaction + invoice
- DB: RLS on all client data, DB-level double-booking constraint, append-only audit log

## Not built yet (honest list)
- Spanish language switching (strings file exists, not wired), CMS/blog/FAQ/team pages (content is placeholder in src/lib/content.ts)
- Booking is a *request* (staff confirm); no availability engine, no email/SMS
- Document upload/storage UI, messaging UI, forms, tasks, calendar, reports, user/role admin UI, refunds, MFA, e-signature, video
- PayPal/Square adapters (interface ready), webhook/transaction detail pages
- Not run against a live Supabase or Stripe yet; first real test is yours
