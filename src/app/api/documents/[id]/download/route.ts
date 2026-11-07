import { NextResponse } from "next/server"; import { supabaseServer, supabaseAdmin, audit } from "@/lib/supabase/server";
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const sb = supabaseServer(); const { data: { user } } = await sb.auth.getUser(); if (!user) return new NextResponse("Unauthorized", { status: 401 });
  const { data: d } = await sb.from("documents").select("id").eq("id", params.id).maybeSingle(); if (!d) return new NextResponse("Not found", { status: 404 }); // RLS decides access
  const db = supabaseAdmin(); const { data: v } = await db.from("document_versions").select("storage_path").eq("document_id", d.id).order("version", { ascending: false }).limit(1).single();
  const { data: s } = await db.storage.from("documents").createSignedUrl(v!.storage_path, 60); await audit(user.id, "document.downloaded", "document", d.id);
  return s ? NextResponse.redirect(s.signedUrl) : new NextResponse("Unavailable", { status: 500 });
}
