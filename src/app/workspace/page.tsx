import { redirect } from "next/navigation"; import { supabaseServer } from "@/lib/supabase/server";
export default async function Workspace() {
  const sb = supabaseServer(); const { data: staff } = await sb.rpc("is_staff"); if (!staff) redirect("/portal");
  const { data: cases } = await sb.from("cases").select("id,reference,category,stage,priority").order("updated_at", { ascending: false });
  const stages = ["new_inquiry","consultation_scheduled","initial_assessment","engagement_onboarding","document_collection","preparation","filed_submitted","awaiting_decision","completed","closed"];
  return (<main className="px-5 py-12"><h1 className="font-serif text-4xl">Case pipeline</h1><div className="mt-8 flex gap-3 overflow-x-auto pb-4">{stages.map(s => <div key={s} className="card w-56 shrink-0 p-3"><p className="font-mono text-xs text-muted">{s.replace(/_/g, " ")}</p>
    {cases?.filter((c: any) => c.stage === s).map((c: any) => <div key={c.id} className="mt-2 rounded-lg bg-slate p-3 text-sm"><p className="font-mono text-xs text-bronze">{c.reference}</p>{c.category}</div>)}</div>)}</div></main>);
}
