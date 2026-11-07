import { redirect } from "next/navigation"; import Shell from "@/components/Shell"; import { supabaseServer } from "@/lib/supabase/server"; import { signOut } from "@/app/portal/(app)/actions";
export const dynamic = "force-dynamic";
export default async function WorkLayout({ children }: { children: React.ReactNode }) {
  const sb = supabaseServer(); const { data: { user } } = await sb.auth.getUser(); if (!user) redirect("/portal/login?next=/workspace"); const { data: staff } = await sb.rpc("is_staff"); if (!staff) redirect("/portal");
  const { data: adm } = await sb.rpc("has_permission", { p: "user.manage" });
  const items = [["", "Overview", "grid"], ["/pipeline", "Case Pipeline", "board"], ["/cases", "All Cases", "cases"], ["/calendar", "Calendar", "cal"], ["/tasks", "Tasks and Deadlines", "tasks"], ["/reviews", "Document Review", "review"], ["/messages", "Messages", "msg"], ["/clients", "Clients", "users"], ["/forms", "Forms", "forms"], ["/invoices", "Invoices", "pay"], ["/reports", "Reports", "chart"]].map(([h, l, i]) => ({ href: `/workspace${h}`, label: l, icon: i }));
  if (adm) items.push({ href: "/admin", label: "Admin dashboard", icon: "shield" });
  return <Shell brand="Vargas Law" sub="Attorney workspace" items={items} who={user.email ?? ""} signOut={signOut}>{children}</Shell>;
}
