import Link from "next/link";
import { Nav, Footer, Btn } from "@/components/Nav";
import GlobeLoader from "@/components/GlobeLoader";
import { SERVICES, STEPS } from "@/lib/content";
export default function Home() {
  return (<><Nav /><main>
    <section className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-4 px-5 pt-24 md:grid-cols-2">
      <div><h1 className="font-serif text-4xl leading-tight md:text-6xl">Your Journey to the United States Deserves a Clear Legal Path.</h1>
        <p className="mt-6 max-w-md text-muted">Immigration guidance for individuals, families, and businesses navigating important decisions about their future in the United States.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Btn href="/book-consultation">Book a Consultation</Btn><Btn href="/immigration-services">Explore Immigration Services</Btn></div></div>
      <GlobeLoader /></section>
    <section className="mx-auto max-w-6xl px-5"><h2 className="font-serif text-3xl">Immigration services</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{SERVICES.map(s => <Link key={s.slug} href={`/immigration-services/${s.slug}`} className="card p-6 hover:border-bronze/60"><h3 className="font-serif text-xl">{s.title}</h3><p className="mt-2 text-sm text-muted">{s.blurb}</p></Link>)}</div></section>
    <section className="mx-auto mt-24 max-w-6xl px-5"><h2 className="font-serif text-3xl">How the process works</h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-5">{STEPS.map((s, i) => <li key={s} className="card p-5"><span className="font-mono text-xs text-bronze">{i + 1}</span><p className="mt-2">{s}</p></li>)}</ol>
      <p className="mt-3 text-xs text-muted">Explanatory stages, not guaranteed outcomes.</p></section>
    <section className="mx-auto mt-24 max-w-3xl px-5 text-center"><h2 className="font-serif text-4xl">Let&apos;s Discuss Your Immigration Goals.</h2><div className="mt-8 flex justify-center gap-3"><Btn href="/book-consultation">Book a Consultation</Btn><Btn href="/contact">Contact the Firm</Btn></div></section>
  </main><Footer /></>);
}
