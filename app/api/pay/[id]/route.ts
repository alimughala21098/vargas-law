import { NextResponse } from "next/server"; import { randomUUID } from "node:crypto";
import { supabaseServer, supabaseAdmin } from "@/lib/supabase/server"; import { getAdapter } from "@/lib/payments/registry"; import { decryptSecret } from "@/lib/payments/crypto";
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const sb = supabaseServer(); const { data: { user } } = await sb.auth.getUser(); if (!user) return NextResponse.redirect(new URL("/portal/login", req.url), 303);
  const { data: inv } = await sb.from("invoices").select("*").eq("id", params.id).single(); // RLS: own invoices only
  const adm = supabaseAdmin(); const { data: cfg } = await adm.from("payment_gateway_configs").select("*").eq("status", "active").single();
  if (!inv || inv.status !== "open" || !cfg) return NextResponse.redirect(new URL("/portal/payments", req.url), 303);
  const ad = getAdapter(cfg.provider); const creds = Object.fromEntries(Object.entries(cfg.encrypted_credentials as Record<string, string>).map(([k, v]) => [k, decryptSecret(v)]));
  const { data: txn } = await adm.from("payment_transactions").insert({ invoice_id: inv.id, config_id: cfg.id, provider: cfg.provider, environment: cfg.environment, amount_minor: inv.amount_minor, currency: inv.currency }).select().single();
  const site = process.env.NEXT_PUBLIC_SITE_URL!;
  const s = await ad.createCheckout(creds, { transactionId: txn.id, amountMinor: inv.amount_minor, currency: inv.currency, description: `Invoice ${inv.number}`, customerEmail: user.email, successUrl: `${site}/portal/payments`, cancelUrl: `${site}/portal/payments`, idempotencyKey: randomUUID() });
  await adm.from("payment_transactions").update({ provider_ref: s.providerRef }).eq("id", txn.id);
  return NextResponse.redirect(s.redirectUrl, 303);
}
