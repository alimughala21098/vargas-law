"use server";
import { revalidatePath } from "next/cache"; import { requirePerm, supabaseAdmin, audit } from "@/lib/supabase/server";
import { getAdapter } from "@/lib/payments/registry"; import { encryptSecret, decryptSecret } from "@/lib/payments/crypto";
const creds = (enc: Record<string, string>) => Object.fromEntries(Object.entries(enc).map(([k, v]) => [k, decryptSecret(v)]));
export async function saveGateway(f: FormData) {
  const u = await requirePerm("payment_gateway.create"); const provider = String(f.get("provider")); const env = String(f.get("environment")) as "test" | "live"; const ad = getAdapter(provider);
  if (!ad) throw new Error("No adapter implemented for this provider yet.");
  const enc: Record<string, string> = {}; for (const fld of ad.credentialFields) { const v = String(f.get(fld.key) ?? "").trim(); if (v) enc[fld.key] = encryptSecret(v); }
  await supabaseAdmin().from("payment_gateway_configs").upsert({ provider, environment: env, encrypted_credentials: enc, status: "connected_disabled", created_by: u.id, updated_at: new Date() }, { onConflict: "provider,environment" });
  await audit(u.id, "gateway.credentials_saved", "gateway", provider, { env }); revalidatePath("/admin/payment-gateways");
}
export async function testGateway(f: FormData) {
  const u = await requirePerm("payment_gateway.test"); const id = String(f.get("id")); const db = supabaseAdmin();
  const { data: c } = await db.from("payment_gateway_configs").select("*").eq("id", id).single(); const r = await getAdapter(c.provider).testConnection(creds(c.encrypted_credentials), c.environment);
  await db.from("payment_gateway_configs").update({ last_test_at: r.testedAt, last_test_ok: r.ok, last_test_message: r.message, status: r.ok ? (c.status === "active" ? "active" : "connected_disabled") : "error" }).eq("id", id);
  await audit(u.id, "gateway.tested", "gateway", id, { ok: r.ok }); revalidatePath("/admin/payment-gateways");
}
export async function activateGateway(f: FormData) {
  const u = await requirePerm("payment_gateway.activate"); const id = String(f.get("id")); const db = supabaseAdmin();
  const { data: c } = await db.from("payment_gateway_configs").select("*").eq("id", id).single();
  if (!c.last_test_ok) throw new Error("Run a successful connection test first.");
  if (c.environment === "live" && f.get("confirm_live") !== "on") throw new Error("Confirm live mode to activate.");
  await db.from("payment_gateway_configs").update({ status: "connected_disabled" }).eq("status", "active");
  await db.from("payment_gateway_configs").update({ status: "active" }).eq("id", id);
  await audit(u.id, "gateway.activated", "gateway", id, { env: c.environment }); revalidatePath("/admin/payment-gateways");
}
export async function disableGateway(f: FormData) {
  const u = await requirePerm("payment_gateway.disable"); const id = String(f.get("id"));
  await supabaseAdmin().from("payment_gateway_configs").update({ status: "disabled" }).eq("id", id); await audit(u.id, "gateway.disabled", "gateway", id); revalidatePath("/admin/payment-gateways");
}
