import { supabaseAdmin } from "@/lib/supabase/server"; import { clientsList } from "@/lib/staff"; import { Title, Badge, Empty } from "@/components/ui"; export const dynamic = "force-dynamic";
export default async function Clients() {
  const db = supabaseAdmin(); const clients = await clientsList(db); const { data: cs } = await db.from("cases").select("client_id");
  return (<><Title crumb="Clients">Clients</Title>{clients.length ? <div className="panel overflow-x-auto"><table><thead><tr><th>Name</th><th>Phone</th><th>Language</th><th>Cases</th><th>Portal access</th></tr></thead><tbody>{clients.map((c: any) => <tr key={c.id}><td>{c.full_name}</td><td className="text-[#8b919b]">{c.phone ?? "-"}</td><td>{c.preferred_language === "es" ? "Español" : "English"}</td><td className="num">{cs?.filter((x: any) => x.client_id === c.id).length}</td><td><Badge s={c.status} /></td></tr>)}</tbody></table></div> : <Empty>No clients yet. Invite one from Admin &gt; Users.</Empty>}</>);
}
