import { notFound } from "next/navigation"; import { supabaseServer } from "@/lib/supabase/server"; import { Title } from "@/components/ui"; import { submitForm } from "../../actions";
export default async function Fill({ params }: { params: { id: string } }) {
  const { data: a } = await supabaseServer().from("form_assignments").select("id,status,answers,form:forms(title,fields)").eq("id", params.id).maybeSingle(); if (!a || a.status === "submitted") notFound(); const fields: any[] = (a as any).form?.fields ?? [];
  return (<><Title crumb="Forms / Fill">{(a as any).form?.title}</Title><form action={submitForm} className="panel max-w-2xl space-y-5 p-6"><input type="hidden" name="id" value={a.id} />
    {fields.map(f => <div key={f.key}><label className="lbl">{f.label}</label>{f.type === "textarea" ? <textarea className="input min-h-24" name={f.key} defaultValue={(a.answers as any)[f.key]} /> : <input className="input" type={f.type ?? "text"} name={f.key} defaultValue={(a.answers as any)[f.key]} />}</div>)}
    <div className="flex gap-3"><button className="btn btn-glass btn-sm" name="final" value="0">Save progress</button><button className="btn btn-sm" name="final" value="1">Submit</button></div></form></>);
}
