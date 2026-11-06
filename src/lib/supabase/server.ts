import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
export function supabaseServer() {
  const c = cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => c.getAll(), setAll: (l: any[]) => { try { l.forEach(({ name, value, options }: any) => c.set(name, value, options)); } catch {} } },
  });
}
/** Service role: server-only. Bypasses RLS. Never import in client components. */
export const supabaseAdmin = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
export async function requirePerm(perm: string) {
  const sb = supabaseServer(); const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error("Not signed in");
  const { data } = await sb.rpc("has_permission", { p: perm });
  if (!data) throw new Error("Forbidden");
  return user;
}
export async function audit(actor: string | null, action: string, type?: string, id?: string, meta: object = {}) {
  await supabaseAdmin().from("audit_logs").insert({ actor_id: actor, action, target_type: type, target_id: id, metadata: meta });
}
