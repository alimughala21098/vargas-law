import { supabaseServer, supabaseAdmin } from "@/lib/supabase/server"; import { Title, Badge, Empty, fmtDate, money } from "@/components/ui";
export const dynamic = "force-dynamic";
export default async function Payments() {
  const sb = supabaseServer(); const { data: inv } = await sb.from("invoices").select("id,number,amount_minor,currency,status,due_date").order("created_at", { ascending: false });
  const { data: gw } = await supabaseAdmin().from("payment_gateway_configs").select("id").eq("status", "active").limit(1); const canPay = !!gw?.length;
  return (<><Title crumb="Payments">Invoices and payments</Title>{!canPay && <p className="panel mb-6 p-4 text-sm text-warn">Online payment is not available right now. Please contact the firm to arrange payment.</p>}
    {inv?.length ? <div className="panel overflow-x-auto"><table><thead><tr><th>Invoice</th><th>Amount</th><th>Due</th><th>Status</th><th /></tr></thead><tbody>{inv.map((i: any) => <tr key={i.id}><td className="mono">{i.number}</td><td className="num">{money(i.amount_minor, i.currency)}</td><td className="num text-[#8b919b]">{fmtDate(i.due_date)}</td><td><Badge s={i.status} /></td><td>{i.status === "open" && canPay && <form action={`/api/pay/${i.id}`} method="post"><button className="btn btn-sm">Pay now</button></form>}</td></tr>)}</tbody></table></div> : <Empty>No invoices yet.</Empty>}</>);
}
