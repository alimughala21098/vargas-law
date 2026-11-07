import Link from "next/link"; import { supabaseServer } from "@/lib/supabase/server"; import { Title, Stat, Badge, Empty, fmtDT, fmtDate, money, stageLabel } from "@/components/ui";
export default async function Overview() {
  const sb = supabaseServer(); const { data: { user } } = await sb.auth.getUser();
  const [cases, appts, docs, forms, inv, hist, unread] = await Promise.all([
    sb.from("cases").select("id,reference,category,stage,updated_at").neq("stage", "closed").order("updated_at", { ascending: false }),
    sb.from("appointments").select("id,starts_at,meeting_mode,type_label,status").eq("client_id", user!.id).gte("starts_at", new Date().toISOString()).neq("status", "canceled").order("starts_at").limit(1),
    sb.from("documents").select("id", { count: "exact", head: true }).eq("review_status", "revision_requested"),
    sb.from("form_assignments").select("id", { count: "exact", head: true }).eq("status", "assigned"),
    sb.from("invoices").select("amount_minor,currency").eq("status", "open"),
    sb.from("case_status_history").select("id,to_stage,created_at,note").order("created_at", { ascending: false }).limit(5),
    sb.from("messages").select("id", { count: "exact", head: true }).is("read_at", null).neq("sender_id", user!.id).eq("internal_note", false)]);
  const c = cases.data?.[0]; const owed = (inv.data ?? []).reduce((s: number, i: any) => s + i.amount_minor, 0); const next = appts.data?.[0];
  return (<><Title crumb="Overview">Welcome to your portal</Title>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Active cases" value={cases.data?.length ?? 0} /><Stat label="Tasks for you" value={(docs.count ?? 0) + (forms.count ?? 0)} note={`${docs.count ?? 0} documents · ${forms.count ?? 0} forms`} /><Stat label="Unread messages" value={unread.count ?? 0} /><Stat label="Outstanding" value={owed ? money(owed) : "None"} /></div>
    <div className="mt-6 grid gap-4 lg:grid-cols-3"><div className="panel p-6 lg:col-span-2"><p className="text-sm text-[#A6ABB3]">Current case</p>{c ? <Link href={`/portal/cases/${c.id}`} className="mt-3 block"><p className="mono text-xs text-[#B99A6A]">{c.reference}</p><p className="mt-1 font-serif text-3xl">{c.category}</p><div className="mt-3"><Badge s={c.stage} /></div></Link> : <p className="mt-3 text-[#8b919b]">Your case will appear here once the firm opens it.</p>}</div>
      <div className="panel p-6"><p className="text-sm text-[#A6ABB3]">Next appointment</p>{next ? <><p className="num mt-3 text-2xl">{fmtDT(next.starts_at)}</p><p className="mt-1 text-sm text-[#8b919b]">{next.type_label ?? "Consultation"} · {next.meeting_mode.replace("_", " ")}</p></> : <p className="mt-3 text-[#8b919b]">Nothing scheduled.</p>}</div></div>
    <h2 className="mb-3 mt-10 text-2xl">Recent activity</h2>{hist.data?.length ? <div className="panel divide-y divide-white/[.06]">{hist.data.map((h: any) => <div key={h.id} className="flex justify-between px-5 py-3 text-sm"><span>Case moved to {stageLabel(h.to_stage)}</span><span className="text-[#8b919b]">{fmtDate(h.created_at)}</span></div>)}</div> : <Empty>No activity yet.</Empty>}</>);
}
