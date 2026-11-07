"use server";
import { redirect } from "next/navigation"; import { revalidatePath } from "next/cache"; import { randomUUID } from "node:crypto"; import { supabaseServer, supabaseAdmin, audit } from "@/lib/supabase/server";
const OK = ["application/pdf", "image/jpeg", "image/png", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
async function me() { const sb = supabaseServer(); const { data: { user } } = await sb.auth.getUser(); if (!user) redirect("/portal/login"); return { sb, user }; }
export async function signOut() { await supabaseServer().auth.signOut(); redirect("/portal/login"); }
export async function uploadDocument(f: FormData) {
  const { sb, user } = await me(); const caseId = String(f.get("case_id")); const file = f.get("file") as File;
  const { data: c } = await sb.from("cases").select("id").eq("id", caseId).maybeSingle(); if (!c) throw new Error("No access to this case");
  if (!file || !file.size) throw new Error("Choose a file"); if (file.size > 10 * 1024 * 1024) throw new Error("File is larger than 10 MB"); if (!OK.includes(file.type)) throw new Error("Only PDF, JPG, PNG or DOCX files");
  const db = supabaseAdmin(); const path = `${caseId}/${randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
  const up = await db.storage.from("documents").upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type }); if (up.error) throw new Error("Upload failed");
  const existing = String(f.get("replace") || ""); let docId = existing, ver = 1;
  if (existing) { const { data: v } = await db.from("document_versions").select("version").eq("document_id", existing).order("version", { ascending: false }).limit(1); ver = (v?.[0]?.version ?? 0) + 1; await db.from("documents").update({ review_status: "pending" }).eq("id", existing); }
  else { const { data: d } = await db.from("documents").insert({ case_id: caseId, category: String(f.get("category") || "General"), uploaded_by: user.id, scan_status: "unscanned" }).select("id").single(); docId = d!.id; }
  await db.from("document_versions").insert({ document_id: docId, version: ver, storage_path: path, mime: file.type, size_bytes: file.size }); await audit(user.id, "document.uploaded", "document", docId, { caseId, ver }); revalidatePath("/portal/documents");
}
export async function sendMessage(f: FormData) {
  const { sb, user } = await me(); const caseId = String(f.get("case_id")), body = String(f.get("body") ?? "").trim(); if (!body) return;
  const { data: c } = await sb.from("cases").select("id").eq("id", caseId).maybeSingle(); if (!c) throw new Error("No access");
  const db = supabaseAdmin(); let { data: cv } = await db.from("conversations").select("id").eq("case_id", caseId).maybeSingle(); if (!cv) cv = (await db.from("conversations").insert({ case_id: caseId }).select("id").single()).data;
  await db.from("messages").insert({ conversation_id: cv!.id, sender_id: user.id, body: body.slice(0, 4000) }); revalidatePath("/portal/messages");
}
export async function submitForm(f: FormData) {
  const { sb, user } = await me(); const id = String(f.get("id")); const { data: a } = await sb.from("form_assignments").select("id,form_id,client_id").eq("id", id).single(); if (!a || a.client_id !== user.id) throw new Error("No access");
  const { data: fm } = await sb.from("forms").select("fields").eq("id", a.form_id).single(); const answers: Record<string, string> = {}; for (const fl of (fm?.fields as any[]) ?? []) answers[fl.key] = String(f.get(fl.key) ?? "");
  const final = f.get("final") === "1"; await supabaseAdmin().from("form_assignments").update({ answers, status: final ? "submitted" : "draft", submitted_at: final ? new Date() : null }).eq("id", id); revalidatePath("/portal/forms"); if (final) redirect("/portal/forms");
}
export async function markAllRead() { const { user } = await me(); await supabaseAdmin().from("notifications").update({ read_at: new Date() }).eq("user_id", user.id).is("read_at", null); revalidatePath("/portal/notifications"); }
export async function updateProfile(f: FormData) { const { user } = await me(); await supabaseAdmin().from("profiles").update({ full_name: String(f.get("full_name")).slice(0, 120), phone: String(f.get("phone")).slice(0, 40), preferred_language: f.get("preferred_language") === "es" ? "es" : "en" }).eq("id", user.id); revalidatePath("/portal/profile"); }
export async function requestDataExport() { const { user } = await me(); await audit(user.id, "privacy.data_export_requested", "user", user.id); revalidatePath("/portal/profile"); }
