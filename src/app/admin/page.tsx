import { supabaseAdmin } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export default async function Admin() {
  const db = supabaseAdmin(); const n = async (t: string, col?: string, val?: string) => { let q: any = db.from(t).select("id", { count: "exact", head: true }); if (col) q = q.eq(col, val); return (await q).count ?? 0; };
  const stats: [string, number][] = [["Cases", await n("cases")], ["Open invoices", await n("invoices", "status", "open")], ["Consultation requests", await n("appointments", "status", "requested")]];
  return (<><h1 className="font-serif text-4xl">Overview</h1><div className="mt-8 grid gap-4 md:grid-cols-3">{stats.map(([l, c]) => <div key={l} className="card p-6"><p className="text-sm text-muted">{l}</p><p className="mt-2 text-3xl">{c}</p></div>)}</div></>);
}
