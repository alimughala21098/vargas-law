import Link from "next/link"; import { supabaseServer } from "@/lib/supabase/server";
export default async function Portal() {
  const sb = supabaseServer(); const { data: cases } = await sb.from("cases").select("id,reference,category,stage,updated_at").order("updated_at", { ascending: false });
  return (<main className="mx-auto max-w-4xl px-5 py-12"><div className="flex items-center justify-between"><h1 className="font-serif text-4xl">My cases</h1><Link href="/portal/invoices" className="glass rounded-full px-4 py-2 text-sm">Invoices</Link></div>
    <div className="mt-8 space-y-3">{cases?.length ? cases.map((c: any) => <div key={c.id} className="card flex justify-between p-5"><div><p className="font-mono text-xs text-bronze">{c.reference}</p><p>{c.category}</p></div><p className="text-sm text-muted">{String(c.stage).replace(/_/g, " ")}</p></div>) : <p className="text-muted">No cases yet.</p>}</div></main>);
}
