import Link from "next/link"; import { SERVICES } from "@/lib/content"; import { getLang } from "@/lib/locale"; import { Arrow } from "@/components/Nav";
export const metadata = { title: "Immigration Services" };
export default function Services() {
  const es = getLang() === "es";
  return (<div className="mx-auto max-w-6xl px-6 pt-36"><h1 className="text-5xl sm:text-7xl">{es ? "Servicios de inmigración" : "Immigration Services"}</h1>
    <div className="mt-14 grid gap-4 md:grid-cols-2">{SERVICES.map((s, i) => <Link key={s.slug} href={`/immigration-services/${s.slug}`} className={`panel group p-8 transition-colors hover:border-[#B99A6A]/50 ${i === 0 ? "md:col-span-2" : ""}`}><h2 className="text-3xl">{es ? s.es : s.title}</h2><p className="mt-3 max-w-xl text-[#A6ABB3]">{es ? s.blurbEs : s.blurb}</p><span className="mt-8 flex items-center gap-2 text-sm">{es ? "Ver proceso y documentos" : "See process and documents"}<Arrow /></span></Link>)}</div></div>);
}
