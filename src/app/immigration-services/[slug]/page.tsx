import { notFound } from "next/navigation"; import { Nav, Footer, Btn } from "@/components/Nav"; import { SERVICES, DISCLAIMER } from "@/lib/content";
export const generateStaticParams = () => SERVICES.map(s => ({ slug: s.slug }));
export default function Service({ params }: { params: { slug: string } }) {
  const s = SERVICES.find(x => x.slug === params.slug); if (!s) notFound();
  return (<><Nav /><main className="mx-auto max-w-3xl px-5 pt-32"><h1 className="font-serif text-5xl">{s.title}</h1><p className="mt-6 text-lg text-muted">{s.blurb}</p>
    <div className="card mt-10 p-6 text-sm text-muted">[Attorney-approved eligibility, process, documentation and FAQ content pending confirmation]<p className="mt-2">{DISCLAIMER}</p></div>
    <div className="mt-8"><Btn href="/book-consultation">Book a Consultation</Btn></div></main><Footer /></>);
}
