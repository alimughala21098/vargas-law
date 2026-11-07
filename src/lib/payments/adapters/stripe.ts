import { createHmac, timingSafeEqual } from "node:crypto";
import type { PaymentGatewayAdapter } from "../types";
const API = "https://api.stripe.com/v1";
export const stripe: PaymentGatewayAdapter = {
  id: "stripe", displayName: "Stripe", supportsRefunds: false, supportedCurrencies: ["USD"],
  credentialFields: [{ key: "secret_key", label: "Secret key", secret: true }, { key: "webhook_secret", label: "Webhook signing secret", secret: true }],
  async testConnection(c, env) {
    const k = c.secret_key ?? ""; const testedAt = new Date();
    if (!k.includes(env === "live" ? "_live_" : "_test_")) return { ok: false, environment: env, message: `Key does not look like a ${env} key.`, testedAt };
    const r = await fetch(`${API}/balance`, { headers: { Authorization: `Bearer ${k}` } });
    return { ok: r.ok, environment: env, message: r.ok ? "Connected to Stripe." : `Stripe rejected the key (HTTP ${r.status}).`, testedAt };
  },
  async createCheckout(c, i) {
    const b = new URLSearchParams({ mode: "payment", success_url: i.successUrl, cancel_url: i.cancelUrl, "line_items[0][quantity]": "1", "line_items[0][price_data][currency]": i.currency.toLowerCase(),
      "line_items[0][price_data][unit_amount]": String(i.amountMinor), "line_items[0][price_data][product_data][name]": i.description, "metadata[transaction_id]": i.transactionId });
    if (i.customerEmail) b.set("customer_email", i.customerEmail);
    const r = await fetch(`${API}/checkout/sessions`, { method: "POST", headers: { Authorization: `Bearer ${c.secret_key}`, "Idempotency-Key": i.idempotencyKey }, body: b });
    const j = await r.json(); if (!r.ok) throw new Error(j.error?.message ?? "Stripe error");
    return { providerRef: j.id, redirectUrl: j.url };
  },
  async verifyWebhook(raw, h, c) {
    const sig = h.get("stripe-signature") ?? ""; const t = /t=(\d+)/.exec(sig)?.[1]; const v1 = [...sig.matchAll(/v1=([a-f0-9]+)/g)].map(m => m[1]);
    if (!t || !c.webhook_secret || Math.abs(Date.now() / 1000 - +t) > 300) throw new Error("bad signature");
    const exp = createHmac("sha256", c.webhook_secret).update(`${t}.${raw}`).digest("hex");
    if (!v1.some(s => s.length === exp.length && timingSafeEqual(Buffer.from(s), Buffer.from(exp)))) throw new Error("bad signature");
    const e = JSON.parse(raw); const o = e.data?.object ?? {};
    const status = e.type === "checkout.session.completed" && o.payment_status === "paid" ? "succeeded" : e.type === "checkout.session.expired" ? "canceled" : undefined;
    return { eventId: e.id, type: e.type, providerRef: o.id, status, amountMinor: o.amount_total, receivedAt: new Date() };
  },
};
