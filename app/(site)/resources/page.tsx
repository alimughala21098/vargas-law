import Link from "next/link"; import { ARTICLES } from "@/lib/content"; export const metadata = { title: "Resources" };
export default function Resources({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? "").toLowerCase(); const list = ARTICLES.filter(a => (a.title + a.excerpt).toLowerCase().includes(q));
  return (<div className="mx-auto max-w-5xl px-6 pt-36"><h1 className="text-5xl sm:text-7xl">Resources</h1><form className="mt-8 max-w-md"><input className="input" name="q" defaultValue={searchParams.q} placeholder="Search guides" aria-label="Search guides" /></form>
    <div className="mt-12 divide-y divide-white/10 border-y border-white/10">{list.length ? list.map(a => <Link key={a.slug} href={`/resources/${a.slug}`} className="group flex flex-wrap items-baseline justify-between gap-4 py-7"><div><h2 className="text-3xl transition-colors group-hover:text-[#B99A6A]">{a.title}</h2><p className="mt-2 text-[#A6ABB3]">{a.excerpt}</p></div><span className="num text-sm text-[#8b919b]">{a.read} min read</span></Link>) : <p className="py-10 text-[#8b919b]">No guides match your search.</p>}</div></div>);
}
