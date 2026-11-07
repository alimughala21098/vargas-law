import Link from "next/link"; import { Arrow } from "@/components/Nav"; import GlobeLoader from "@/components/GlobeLoader"; import Reveal from "@/components/Reveal"; import PortalPreview from "@/components/PortalPreview"; import FAQ from "@/components/FAQ";
import { SERVICES, STEPS, DEFAULT_FAQS } from "@/lib/content"; import { getLang, t } from "@/lib/locale"; import { supabaseAdmin } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export default async function Home() {
  const lang = getLang(), L = t(lang); const db = supabaseAdmin();
  const { data: faqs } = await db.from("faqs").select("question,answer").eq("published", true).order("sort").limit(6);
  const { data: team } = await db.from("team_profiles").select("id,name,title,languages").eq("published", true).order("sort").limit(4);
  return (<>
    <section className="relative overflow-hidden"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_75%_40%,#17243a_0%,transparent_70%)]" />
      <div className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-2 px-6 pt-28 lg:grid-cols-[1.05fr_1fr]">
        <div className="pb-10"><h1 className="text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-[4.4rem]">{L.heroH}</h1>
          <p className="mt-6 max-w-md text-lg text-[#A6ABB3]">{L.heroP}</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link href="/book-consultation" className="btn">{L.book}<Arrow /></Link><Link href="/immigration-services" className="btn btn-glass">{L.explore}</Link></div></div>
        <GlobeLoader /></div></section>

    <section className="mx-auto -mt-6 max-w-6xl px-6"><Reveal><PortalPreview /></Reveal></section>

    <section className="mx-auto mt-32 max-w-6xl px-6"><Reveal><div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]"><div><h2 className="text-4xl sm:text-5xl">{L.svcH}</h2><p className="mt-5 max-w-sm text-[#A6ABB3]">{L.svcP}</p></div>
      <ul className="divide-y divide-white/10 border-y border-white/10">{SERVICES.map(s => <li key={s.slug}><Link href={`/immigration-services/${s.slug}`} className="group flex items-center justify-between gap-6 py-5"><div><span className="font-serif text-2xl transition-colors group-hover:text-[#B99A6A]">{lang === "es" ? s.es : s.title}</span><span className="mt-1 block max-w-md text-sm text-[#8b919b]">{lang === "es" ? s.blurbEs : s.blurb}</span></div><span className="flex shrink-0 items-center gap-2 text-sm text-[#A6ABB3] transition-all group-hover:translate-x-1 group-hover:text-white">{L.learn}<Arrow /></span></Link></li>)}</ul></div></Reveal></section>

    <section className="mx-auto mt-32 max-w-6xl px-6"><Reveal><h2 className="text-4xl sm:text-5xl">{L.procH}</h2></Reveal>
      <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-5">{STEPS.map((s, i) => <Reveal as="li" key={s.t} delay={i * 80} className="bg-[#0b101a] p-6"><span className="mono num text-xs text-[#B99A6A]">0{i + 1}</span><h3 className="mt-6 text-xl">{lang === "es" ? s.es : s.t}</h3><p className="mt-2 text-sm text-[#8b919b]">{s.d}</p></Reveal>)}</ol>
      <p className="mt-4 text-xs text-[#8b919b]">{L.procNote}</p></section>

    <section className="mx-auto mt-32 max-w-6xl px-6"><Reveal><div className="grid items-center gap-10 overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_at_80%_20%,#1b2a44,#0e1524_60%)] p-8 sm:p-14 lg:grid-cols-2"><div><h2 className="text-4xl sm:text-5xl">{L.globH}</h2><p className="mt-5 max-w-md text-[#A6ABB3]">{L.globP}</p>
      <Link href="/book-consultation" className="btn mt-8">{L.book}<Arrow /></Link></div>
      <svg viewBox="0 0 400 220" className="w-full" aria-hidden><g fill="none" stroke="#B99A6A" strokeWidth="1.2">{[[60, 150, 160, 40, 300, 70], [90, 190, 190, 60, 300, 70], [40, 120, 150, 20, 300, 70]].map((p, i) => <path key={i} d={`M${p[0]} ${p[1]} Q${p[2]} ${p[3]} ${p[4]} ${p[5]}`} strokeDasharray="4 5" />)}</g>{[[60, 150], [90, 190], [40, 120]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="4" fill="#F5F1E9" />)}<circle cx="300" cy="70" r="6" fill="#35C98B" /></svg></div></Reveal></section>

    <section className="mx-auto mt-32 max-w-6xl px-6"><Reveal><h2 className="text-4xl sm:text-5xl">{L.teamH}</h2></Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{team?.length ? team.map((m: any) => <Link key={m.id} href="/team" className="panel p-6"><div className="mb-8 h-40 rounded-lg bg-white/5" /><p className="font-serif text-xl">{m.name}</p><p className="text-sm text-[#8b919b]">{m.title}</p></Link>) : [0, 1, 2].map(i => <div key={i} className="panel p-6"><div className="mb-8 h-40 rounded-lg border border-dashed border-white/15" /><p className="font-serif text-xl">[Attorney name pending confirmation]</p><p className="text-sm text-[#8b919b]">[Title and bar admission pending confirmation]</p></div>)}</div></section>

    <section className="mx-auto mt-32 grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_1.4fr]"><Reveal><h2 className="text-4xl sm:text-5xl">{L.faqH}</h2><Link href="/faq" className="navlink mt-6 inline-block">All questions</Link></Reveal><FAQ items={faqs?.length ? (faqs as any) : DEFAULT_FAQS} /></section>

    <section className="mx-auto mt-32 max-w-4xl px-6 text-center"><Reveal><h2 className="text-5xl sm:text-6xl">{L.ctaH}</h2><div className="mt-9 flex flex-wrap justify-center gap-3"><Link href="/book-consultation" className="btn">{L.book}<Arrow /></Link><Link href="/contact" className="btn btn-glass">{L.contactFirm}</Link></div></Reveal></section></>);
}
