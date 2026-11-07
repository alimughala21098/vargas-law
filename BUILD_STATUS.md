# BUILD_STATUS v0.3 (typechecks, production build passes, key pages screenshot-checked)

## Built and working (needs your Supabase project)
- Public: home (WebGL dot-matrix globe with route arcs and labels, portal preview, services, process, FAQ, team, CTA), about, team, 7 service pages with process/documents/FAQ, resources + 3 starter guides with search, FAQ, contact (saved to DB), privacy/terms/accessibility placeholders, EN/ES switch for site chrome and key sections, custom cursor, scroll reveals, floating CTA, reduced-motion fallbacks
- Booking: 6-step wizard, server-side slots, DB-level double-booking guard, .ics download, cancel/reschedule link
- Auth: invite-only login, forgot/reset password, route protection
- Portal: overview, cases + timeline, documents (private storage, versions, signed downloads), messages, appointments, forms (save draft / submit), payments (Stripe checkout), notifications, profile, data-export request, help
- Workspace: overview, kanban pipeline, cases (create/assign/stage/notes/tasks), tasks, document review (approve/revise/reject with client comment), messages with internal notes, clients, calendar with confirm/cancel, forms builder + assignment, invoices, reports from live data
- Admin: overview, users (invite, roles, suspend), permission matrix, cases, inquiries, FAQ + team CMS, audit log, system settings status, payment gateways (encrypted credentials, real Stripe connection test, test/live split, live confirmation, activate/disable/remove, transactions, webhooks log)
- Security: RLS on all tables, server-side permission checks, append-only audit log, verified idempotent webhooks

## Not built (honest list)
- Email/SMS/WhatsApp sending, video rooms, e-signature, malware scanning (status page shows them as not configured)
- Spanish for long-form service/guide text (pending approved translation); no blog/page CMS (guides live in code)
- Refunds, payment plans, pay-at-booking, PayPal/Square adapters, MFA/passkey UI (enable MFA in Supabase), family/sponsor access, availability rules per attorney (one default schedule), user-facing session management
- Not tested against a live Supabase or Stripe; first real run is yours
- Firm details (attorneys, address, phone, testimonials) are placeholders by design
