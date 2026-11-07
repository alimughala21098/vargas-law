import { notFound } from "next/navigation"; import Link from "next/link"; import { ARTICLES, SITE_DISCLAIMER } from "@/lib/content"; import { Arrow } from "@/components/Nav";
export default function Article({ params }: { params: { slug: string } }) {
  const a = ARTICLES.find(x => x.slug === params.slug); if (!a) notFound(); const rel = ARTICLES.filter(x => x.slug !== a.slug);
  return (<article className="mx-auto max-w-2xl px-6 pt-36"><Link href="/resources" className="navlink text-sm">Resources</Link><h1 className="mt-4 text-4xl leading-tight sm:text-6xl">{a.title}</h1>
    <p className="mt-5 text-sm text-[#8b919b]">Vargas Law Group · <time dateTime={a.date}>{new Date(a.date).toLocaleDateString("en-US", { dateStyle: "long" })}</time> · {a.read} min read</p>
    <div className="mt-10 space-y-6 font-serif text-xl leading-relaxed text-[#D9D5CA]">{a.body.map((p, i) => <p key={i}>{p}</p>)}</div><p className="mt-10 text-xs text-[#8b919b]">{SITE_DISCLAIMER}</p>
    <div className="panel mt-14 p-8"><h2 className="text-3xl">Talk to an attorney about your situation</h2><Link href="/book-consultation" className="btn mt-5">Book a Consultation<Arrow /></Link></div>
    <h2 className="mt-16 text-2xl">More guides</h2><ul className="mt-4 space-y-2">{rel.map(r => <li key={r.slug}><Link className="navlink" href={`/resources/${r.slug}`}>{r.title}</Link></li>)}</ul></article>);
}
