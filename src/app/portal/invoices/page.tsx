import { supabaseServer, supabaseAdmin } from "@/lib/supabase/server";
export default async function Invoices() {
  const sb = supabaseServer(); const { data: inv } = await sb.from("invoices").select("id,number,amount_minor,currency,status,due_date").order("created_at", { ascending: false });
  const { data: gw } = await supabaseAdmin().from("payment_gateway_configs").select("id").eq("status", "active").limit(1);
  return (<main className="mx-auto max-w-4xl px-5 py-12"><h1 className="font-serif text-4xl">Invoices</h1>
    {!gw?.length && <p className="card mt-6 p-4 text-sm text-warn">Online payment is not available right now. Please contact the firm to arrange payment.</p>}
    <div className="mt-6 space-y-3">{inv?.map((i: any) => <div key={i.id} className="card flex items-center justify-between p-5"><div><p className="font-mono text-xs">{i.number}</p><p>{(i.amount_minor / 100).toFixed(2)} {i.currency}</p></div>
      {i.status === "open" && gw?.length ? <form action={`/api/pay/${i.id}`} method="post"><button className="glass rounded-full px-4 py-2 text-sm">Pay now</button></form> : <span className="text-sm text-muted">{i.status}</span>}</div>)}</div></main>);
}
