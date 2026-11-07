import { z } from "zod"; import { NextResponse } from "next/server"; import { supabaseAdmin } from "@/lib/supabase/server";
const S = z.object({ name: z.string().min(2).max(120), email: z.string().email(), phone: z.string().max(40).optional(), category: z.string().max(60), preferred_contact: z.string().max(30), language: z.enum(["en", "es"]), message: z.string().min(5).max(3000) });
export async function POST(req: Request) { const p = S.safeParse(await req.json().catch(() => null)); if (!p.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { error } = await supabaseAdmin().from("contact_inquiries").insert(p.data); return error ? NextResponse.json({ error: "save" }, { status: 500 }) : NextResponse.json({ ok: true }); }
