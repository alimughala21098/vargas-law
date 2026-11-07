import { redirect } from "next/navigation"; import Shell from "@/components/Shell"; import { supabaseServer } from "@/lib/supabase/server"; import { signOut } from "./actions";
export const dynamic = "force-dynamic";
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const sb = supabaseServer(); const { data: { user } } = await sb.auth.getUser(); if (!user) redirect("/portal/login");
  const { count } = await sb.from("notifications").select("id", { count: "exact", head: true }).is("read_at", null);
  const items = [["", "Overview", "grid"], ["/cases", "My Cases", "cases"], ["/documents", "Documents", "docs"], ["/messages", "Messages", "msg"], ["/appointments", "Appointments", "cal"], ["/forms", "Forms", "forms"], ["/payments", "Payments", "pay"], ["/notifications", "Notifications", "bell"], ["/profile", "My Profile", "user"], ["/help", "Help and Support", "help"]].map(([h, l, i]) => ({ href: `/portal${h}`, label: l, icon: i, badge: l === "Notifications" ? count ?? 0 : 0 }));
  return <Shell brand="Vargas Law" sub="Client portal" items={items} who={user.email ?? ""} signOut={signOut}>{children}</Shell>;
}
