import { redirect } from "next/navigation"; import { supabaseServer, supabaseAdmin } from "@/lib/supabase/server"; import { listProviders, getAdapter } from "@/lib/payments/registry";
import { saveGateway, testGateway, activateGateway, disableGateway } from "../actions";
export const dynamic = "force-dynamic";
export default async function Gateways() {
  const { data: ok } = await supabaseServer().rpc("has_permission", { p: "payment_gateway.view" }); if (!ok) redirect("/admin");
  const db = supabaseAdmin(); const { data: cfgs } = await db.from("payment_gateway_configs").select("id,provider,environment,status,last_test_at,last_test_ok,last_test_message,encrypted_credentials");
  const { data: txns } = await db.from("payment_transactions").select("id,provider,amount_minor,currency,status,created_at").order("created_at", { ascending: false }).limit(15);
  const providers = listProviders(); const stripe = getAdapter("stripe");
  return (<><h1 className="font-serif text-4xl">Payment gateways</h1>
    {!process.env.PAYMENT_ENCRYPTION_KEY && <p className="card mt-4 p-4 text-warn">PAYMENT_ENCRYPTION_KEY is not set. Credentials cannot be saved until it is configured.</p>}
    <section className="mt-8 grid gap-4 md:grid-cols-2">{cfgs?.map((c: any) => <div key={c.id} className="card p-5"><p className="font-serif text-xl capitalize">{c.provider} <span className="font-mono text-xs text-muted">{c.environment}</span></p>
      <p className="mt-1 text-sm">Status: <b>{c.status.replace(/_/g, " ")}</b></p><p className="text-xs text-muted">{c.last_test_at ? `Last test: ${c.last_test_message}` : "Not tested"} · credentials: {Object.keys(c.encrypted_credentials).map(k => `${k} ••••`).join(", ")}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2"><form action={testGateway}><input type="hidden" name="id" value={c.id} /><button className="glass rounded-full px-3 py-1.5 text-sm">Test connection</button></form>
        {c.status === "active" ? <form action={disableGateway}><input type="hidden" name="id" value={c.id} /><button className="glass rounded-full px-3 py-1.5 text-sm">Disable</button></form> :
          <form action={activateGateway} className="flex items-center gap-2"><input type="hidden" name="id" value={c.id} />{c.environment === "live" && <label className="flex items-center gap-1 text-xs"><input type="checkbox" name="confirm_live" className="!w-auto" />Confirm live</label>}<button className="glass rounded-full px-3 py-1.5 text-sm">Activate</button></form>}</div></div>)}</section>
    <section className="card mt-8 max-w-xl p-6"><h2 className="font-serif text-2xl">Add or replace credentials</h2>
      <p className="mt-1 text-xs text-muted">Providers: {providers.map(p => `${p.name}${p.adapterImplemented ? "" : " (adapter required)"}`).join(", ")}. Webhook URL: <span className="font-mono">/api/webhooks/payments/stripe</span></p>
      <form action={saveGateway} className="mt-4 space-y-3"><select name="provider">{providers.filter(p => p.adapterImplemented).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <select name="environment"><option value="test">Test / sandbox</option><option value="live">Live</option></select>
        {stripe.credentialFields.map(f => <input key={f.key} name={f.key} type="password" autoComplete="off" placeholder={f.label} />)}<button className="glass rounded-full px-5 py-2">Save (encrypted)</button></form></section>
    <section className="mt-8"><h2 className="font-serif text-2xl">Recent transactions</h2><div className="mt-3 space-y-2">{txns?.length ? txns.map((t: any) => <div key={t.id} className="card flex justify-between p-3 text-sm"><span>{t.provider}</span><span>{(t.amount_minor / 100).toFixed(2)} {t.currency}</span><span>{t.status}</span></div>) : <p className="text-sm text-muted">No transactions yet.</p>}</div></section></>);
}
