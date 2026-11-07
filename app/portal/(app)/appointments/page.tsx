import Link from "next/link"; import { supabaseServer } from "@/lib/supabase/server"; import { Title, Badge, Empty, fmtDT } from "@/components/ui";
export default async function Appointments() {
  const sb = supabaseServer(); const { data: { user } } = await sb.auth.getUser(); const { data } = await sb.from("appointments").select("*").eq("client_id", user!.id).order("starts_at", { ascending: false });
  const up = (data ?? []).filter((a: any) => new Date(a.starts_at) >= new Date() && a.status !== "canceled");
  return (<><Title crumb="Appointments" right={<Link href="/book-consultation" className="btn btn-sm">Book a time</Link>}>Appointments</Title>
    {data?.length ? <div className="panel divide-y divide-white/[.06]">{data.map((a: any) => <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><div><p className="num">{fmtDT(a.starts_at)}</p><p className="text-sm text-[#8b919b]">{a.type_label ?? "Consultation"} · {a.meeting_mode.replace("_", " ")}</p></div><div className="flex items-center gap-3"><Badge s={a.status} />{up.includes(a) && <Link className="text-sm text-[#B99A6A]" href={`/book-consultation/manage/${a.manage_token}`}>Reschedule or cancel</Link>}</div></div>)}</div> : <Empty>No appointments yet.</Empty>}
    <p className="mt-4 text-xs text-[#8b919b]">Video meeting links appear here once the firm connects a video provider and confirms your time.</p></>);
}
