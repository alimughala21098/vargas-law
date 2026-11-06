import { NextResponse } from "next/server"; import { supabaseAdmin } from "@/lib/supabase/server"; import { getAdapter } from "@/lib/payments/registry"; import { decryptSecret } from "@/lib/payments/crypto";
export async function POST(req: Request, { params }: { params: { provider: string } }) {
  const ad = getAdapter(params.provider); if (!ad) return NextResponse.json({ error: "unknown provider" }, { status: 404 });
  const raw = await req.text(); const db = supabaseAdmin();
  const { data: cfgs } = await db.from("payment_gateway_configs").select("*").eq("provider", params.provider);
  let ev: any = null;
  for (const c of cfgs ?? []) { try { const creds = Object.fromEntries(Object.entries(c.encrypted_credentials as Record<string, string>).map(([k, v]) => [k, decryptSecret(v)])); ev = await ad.verifyWebhook(raw, req.headers, creds); break; } catch {} }
  if (!ev) return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  const { error: dup } = await db.from("payment_webhook_events").insert({ provider: params.provider, event_id: ev.eventId, event_type: ev.type, verified: true, processing_status: "processed" });
  if (dup) return NextResponse.json({ ok: true, duplicate: true }); // idempotent
  if (ev.status && ev.providerRef) {
    const { data: t } = await db.from("payment_transactions").update({ status: ev.status, completed_at: new Date() }).eq("provider", params.provider).eq("provider_ref", ev.providerRef).select().single();
    if (t && ev.status === "succeeded" && t.invoice_id) await db.from("invoices").update({ status: "paid" }).eq("id", t.invoice_id);
  }
  return NextResponse.json({ ok: true });
}
