import Link from "next/link"; import { revalidatePath } from "next/cache"; import { supabaseAdmin } from "@/lib/supabase/server"; export const dynamic = "force-dynamic";
export default async function Manage({ params }: { params: { token: string } }) {
  const db = supabaseAdmin(); const { data: a } = await db.from("appointments").select("id,starts_at,status,meeting_mode,type_label").eq("manage_token", params.token).maybeSingle();
  async function cancel() { "use server"; await supabaseAdmin().from("appointments").update({ status: "canceled" }).eq("manage_token", params.token); revalidatePath(`/book-consultation/manage/${params.token}`); }
  if (!a) return <div className="mx-auto max-w-xl px-6 pt-40"><h1 className="text-4xl">Link not found</h1></div>;
  return (<div className="mx-auto max-w-xl px-6 pt-40"><h1 className="text-4xl">Your consultation</h1><div className="panel mt-8 p-6"><p>{a.type_label}</p><p className="mt-1 text-[#A6ABB3]">{new Date(a.starts_at).toLocaleString([], { dateStyle: "full", timeStyle: "short" })}</p><p className="mt-3"><span className={`badge ${a.status === "canceled" ? "err" : "warn"}`}>{a.status}</span></p></div>
    <div className="mt-6 flex gap-3">{a.status !== "canceled" && <form action={cancel}><button className="btn btn-glass btn-sm">Cancel this request</button></form>}<Link href="/book-consultation" className="btn btn-sm">Book a new time</Link></div><p className="mt-4 text-xs text-[#8b919b]">To reschedule, cancel this request and book a new time.</p></div>);
}
