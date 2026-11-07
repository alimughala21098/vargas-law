import { NextResponse } from "next/server"; import { supabaseAdmin } from "@/lib/supabase/server"; import { slotsFor } from "@/lib/slots";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const date = new URL(req.url).searchParams.get("date") ?? ""; const slots = slotsFor(date); if (!slots.length) return NextResponse.json({ slots: [] });
  const { data } = await supabaseAdmin().from("appointments").select("starts_at").in("status", ["requested", "confirmed"]).gte("starts_at", slots[0].toISOString()).lte("starts_at", slots[slots.length - 1].toISOString());
  const taken = new Set((data ?? []).map((r: any) => new Date(r.starts_at).toISOString()));
  return NextResponse.json({ slots: slots.map(s => ({ iso: s.toISOString(), taken: taken.has(s.toISOString()) })) });
}
