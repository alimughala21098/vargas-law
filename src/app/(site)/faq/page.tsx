import FAQ from "@/components/FAQ"; import { DEFAULT_FAQS } from "@/lib/content"; import { supabaseAdmin } from "@/lib/supabase/server"; export const metadata = { title: "FAQ" }; export const dynamic = "force-dynamic";
export default async function Faq() {
  const { data } = await supabaseAdmin().from("faqs").select("question,answer").eq("published", true).order("sort");
  return (<div className="mx-auto max-w-3xl px-6 pt-36"><h1 className="text-5xl sm:text-7xl">Frequently asked questions</h1><div className="mt-12"><FAQ items={data?.length ? (data as any) : DEFAULT_FAQS} /></div><p className="mt-6 text-xs text-[#8b919b]">Answers are general information and are reviewed by the firm before publication.</p></div>);
}
