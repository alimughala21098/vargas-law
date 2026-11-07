import { supabaseAdmin } from "@/lib/supabase/server"; export const metadata = { title: "Our Team" }; export const dynamic = "force-dynamic";
export default async function Team() {
  const { data } = await supabaseAdmin().from("team_profiles").select("*").eq("published", true).order("sort");
  return (<div className="mx-auto max-w-6xl px-6 pt-36"><h1 className="text-5xl sm:text-7xl">Our team</h1><p className="mt-5 max-w-xl text-[#A6ABB3]">Profiles are published by the firm after attorney confirmation.</p>
    <div className="mt-14 grid gap-5 md:grid-cols-2">{data?.length ? data.map((m: any) => <article key={m.id} className="panel p-8"><h2 className="text-3xl">{m.name}</h2><p className="text-[#B99A6A]">{m.title}</p><p className="mt-4 text-[#A6ABB3]">{m.bio}</p><dl className="mt-6 space-y-1 text-sm text-[#8b919b]">{m.bar_admissions && <div>Bar admissions: {m.bar_admissions}</div>}{m.education && <div>Education: {m.education}</div>}{m.languages && <div>Languages: {m.languages}</div>}</dl></article>) :
      [0, 1].map(i => <article key={i} className="panel p-8"><h2 className="text-3xl">[Attorney name pending confirmation]</h2><p className="text-[#8b919b]">[Title pending confirmation]</p><p className="mt-4 text-[#8b919b]">[Biography, education, bar admissions, and languages pending confirmation]</p></article>)}</div></div>);
}
