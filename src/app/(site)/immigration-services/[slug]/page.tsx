import { notFound } from "next/navigation"; import Link from "next/link"; import FAQ from "@/components/FAQ"; import Reveal from "@/components/Reveal"; import { Arrow } from "@/components/Nav"; import { SERVICES, SITE_DISCLAIMER } from "@/lib/content"; import { getLang } from "@/lib/locale";
export const generateMetadata = ({ params }: any) => ({ title: SERVICES.find(s => s.slug === params.slug)?.title });
export default function Service({ params }: { params: { slug: string } }) {
  const s = SERVICES.find(x => x.slug === params.slug); if (!s) notFound(); const es = getLang() === "es";
  return (<div className="mx-auto max-w-6xl px-6 pt-36"><Link href="/immigration-services" className="navlink text-sm">Immigration Services</Link>
    <h1 className="mt-4 max-w-3xl text-5xl leading-[1.05] sm:text-7xl">{es ? s.es : s.title}</h1><p className="mt-6 max-w-2xl text-xl text-[#C9CDD3]">{s.intro}</p>
    {es && <p className="mt-3 text-xs text-[#8b919b]">Versión completa en español pendiente de traducción aprobada por el despacho.</p>}
    <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_340px]"><div className="space-y-14">
      <Reveal><h2 className="text-3xl">Who this helps</h2><ul className="mt-5 space-y-3 text-[#A6ABB3]">{s.helps.map(h => <li key={h} className="border-l border-[#B99A6A]/50 pl-4">{h}</li>)}</ul></Reveal>
      <Reveal><h2 className="text-3xl">How the process works</h2><ol className="mt-6 space-y-4">{s.process.map((p, i) => <li key={p} className="flex gap-5"><span className="mono num pt-1 text-xs text-[#B99A6A]">0{i + 1}</span><span className="text-[#C9CDD3]">{p}</span></li>)}</ol><p className="mt-4 text-xs text-[#8b919b]">Stages are explanatory. Timelines and outcomes cannot be guaranteed.</p></Reveal>
      <Reveal><h2 className="text-3xl">Documents you may be asked for</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{s.docs.map(d => <li key={d} className="panel px-4 py-3 text-sm text-[#C9CDD3]">{d}</li>)}</ul><p className="mt-3 text-xs text-[#8b919b]">Your attorney confirms the exact list for your case.</p></Reveal>
      <Reveal><h2 className="mb-5 text-3xl">Questions</h2><FAQ items={s.faqs.map(f => ({ question: f.q, answer: f.a }))} /></Reveal></div>
      <aside className="lg:sticky lg:top-28 lg:self-start"><div className="panel p-6"><h3 className="text-2xl">{s.slug === "deportation-defense" ? "Speak with an attorney now" : "Talk to an attorney"}</h3><p className="mt-2 text-sm text-[#A6ABB3]">{s.slug === "asylum" ? "Your consultation is confidential." : "Choose a time that works for you, by video, phone, or in person."}</p><Link href="/book-consultation" className="btn mt-5 w-full justify-center">Book a Consultation<Arrow /></Link></div><p className="mt-4 text-xs text-[#8b919b]">{SITE_DISCLAIMER}</p></aside></div></div>);
}
