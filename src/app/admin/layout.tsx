import Link from "next/link"; import { redirect } from "next/navigation"; import { supabaseServer } from "@/lib/supabase/server";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sb = supabaseServer(); const { data: ok } = await sb.rpc("has_permission", { p: "user.manage" }); if (!ok) redirect("/portal");
  return (<div className="flex min-h-screen bg-charcoal"><aside className="w-56 shrink-0 border-r border-white/10 p-5 text-sm"><p className="font-serif text-lg">Admin</p><nav className="mt-6 space-y-3"><Link className="block" href="/admin">Overview</Link><Link className="block" href="/admin/payment-gateways">Payment gateways</Link><Link className="block" href="/workspace">Case pipeline</Link></nav></aside><div className="flex-1 p-8">{children}</div></div>);
}
