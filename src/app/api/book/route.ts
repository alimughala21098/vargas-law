import { z } from "zod"; import { NextResponse } from "next/server"; import { supabaseAdmin } from "@/lib/supabase/server"; import { TYPES, slotsFor } from "@/lib/slots";
const S = z.object({ type: z.string(), mode: z.enum(["video", "phone", "in_person"]), language: z.enum(["en", "es"]), startIso: z.string(), name: z.string().min(2).max(120), email: z.string().email(), phone: z.string().max(40).optional(), notes: z.string().max(1000).optional() });
export async function POST(req: Request) {
  const p = S.safeParse(await req.json().catch(() => null)); if (!p.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  const type = TYPES.find(t => t.id === p.data.type); const start = new Date(p.data.startIso); const date = start.toISOString().slice(0, 10);
  // the slot must be on the server-generated grid (checks adjacent UTC days for timezone offsets)
  const valid = [-1, 0, 1].flatMap(o => slotsFor(new Date(+start + o * 864e5).toISOString().slice(0, 10))).some(s => +s === +start);
  if (!type || !valid) return NextResponse.json({ error: "That time is not available. Please choose another." }, { status: 400 });
  const { data, error } = await supabaseAdmin().from("appointments").insert({ meeting_mode: p.data.mode, language: p.data.language, starts_at: start, ends_at: new Date(+start + type.min * 60000), status: "requested", contact_name: p.data.name, contact_email: p.data.email, contact_phone: p.data.phone, notes: p.data.notes, type_label: type.name }).select("id,manage_token").single();
  if (error?.code === "23505") return NextResponse.json({ error: "Someone just booked that time. Please choose another." }, { status: 409 });
  if (error || !data) return NextResponse.json({ error: "We could not save your request. Please try again." }, { status: 500 });
  return NextResponse.json({ ref: data.id.slice(0, 8).toUpperCase(), token: data.manage_token, startIso: start.toISOString() });
}
