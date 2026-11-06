import { z } from "zod"; import { NextResponse } from "next/server"; import { supabaseAdmin } from "@/lib/supabase/server";
const S = z.object({ name: z.string().min(2).max(120), email: z.string().email(), mode: z.enum(["video", "phone", "in_person"]), language: z.enum(["en", "es"]), when: z.string() });
export async function POST(req: Request) {
  const p = S.safeParse(await req.json().catch(() => null)); if (!p.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  const start = new Date(p.data.when); if (isNaN(+start) || start < new Date()) return NextResponse.json({ error: "Choose a future date and time." }, { status: 400 });
  const end = new Date(+start + 30 * 60000);
  // Saved as a request: attorney availability rules are not configured yet, so staff confirm it.
  const { error } = await supabaseAdmin().from("appointments").insert({ meeting_mode: p.data.mode, language: p.data.language, starts_at: start, ends_at: end, status: "requested", contact_name: p.data.name, contact_email: p.data.email });
  if (error) return NextResponse.json({ error: "Could not save the request." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
