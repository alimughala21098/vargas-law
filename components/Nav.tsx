"use client";
import Link from "next/link"; import { useEffect, useState } from "react"; import { ArrowRight, Menu, X, ChevronDown } from "lucide-react"; import { setLang } from "@/app/actions";
import { SERVICES } from "@/lib/content";
export const Arrow = () => <ArrowRight size={15} strokeWidth={1.75} />;
export const Mark = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B99A6A" strokeWidth="1.5" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>);
export default function Nav({ lang, L }: { lang: "en" | "es"; L: Record<string, string> }) {
  const [s, setS] = useState(false), [open, setOpen] = useState(false);
  useEffect(() => { const f = () => setS(scrollY > 24); f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  return (<header className="fixed inset-x-0 top-4 z-50 px-4"><nav className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-5 py-3 transition-all duration-300 ${s ? "border-white/[.12] bg-[#0b101a]/85 backdrop-blur-xl" : "border-white/[.08] bg-[#0b101a]/40 backdrop-blur-md"}`} aria-label="Main">
    <Link href="/" className="flex items-center gap-2.5"><Mark /><span className="font-serif text-lg">Vargas Law Group</span></Link>
    <div className="hidden items-center gap-7 lg:flex">
      <Link className="navlink" href="/">{L.home}</Link><Link className="navlink" href="/about">{L.about}</Link>
      <div className="group relative"><Link className="navlink inline-flex items-center gap-1" href="/immigration-services">{L.services}<ChevronDown size={14} /></Link>
        <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"><div className="panel p-2 shadow-2xl">{SERVICES.map(x => <Link key={x.slug} href={`/immigration-services/${x.slug}`} className="block rounded-lg px-3 py-2 text-sm text-[#C9CDD3] hover:bg-white/5 hover:text-white">{lang === "es" ? x.es : x.title}</Link>)}</div></div></div>
      <Link className="navlink" href="/resources">{L.resources}</Link><Link className="navlink" href="/contact">{L.contact}</Link></div>
    <div className="hidden items-center gap-4 lg:flex">
      <form action={setLang} className="flex gap-1 text-xs"><button name="lang" value="en" className={lang === "en" ? "text-white" : "text-[#8b919b]"}>EN</button><span className="text-[#555]">/</span><button name="lang" value="es" className={lang === "es" ? "text-white" : "text-[#8b919b]"}>ES</button></form>
      <Link href="/portal" className="navlink">{L.portal}</Link><Link href="/book-consultation" className="btn btn-sm">{L.book}</Link></div>
    <button className="lg:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></nav>
    {open && <div className="panel mx-auto mt-2 max-w-6xl space-y-1 p-4 lg:hidden" onClick={() => setOpen(false)}>{[["/", L.home], ["/about", L.about], ["/immigration-services", L.services], ["/resources", L.resources], ["/contact", L.contact], ["/portal", L.portal]].map(([h, l]) => <Link key={h} href={h} className="block rounded-lg px-3 py-3 hover:bg-white/5">{l}</Link>)}
      <Link href="/book-consultation" className="btn mt-2 w-full justify-center">{L.book}</Link>
      <form action={setLang} className="flex gap-4 px-3 pt-3 text-sm"><button name="lang" value="en">English</button><button name="lang" value="es">Español</button></form></div>}</header>);
}
