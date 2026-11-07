"use client";
import { useState } from "react"; import Link from "next/link"; import { supabaseBrowser } from "@/lib/supabase/client"; import { Lock } from "lucide-react";
export default function Login() {
  const [err, setErr] = useState(""), [busy, setBusy] = useState(false), [mode, setMode] = useState<"in" | "forgot" | "sent">("in");
  async function go(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setBusy(true); setErr(""); const f = new FormData(e.currentTarget); const sb = supabaseBrowser();
    if (mode === "forgot") { await sb.auth.resetPasswordForEmail(String(f.get("email")), { redirectTo: `${location.origin}/portal/reset-password` }); setMode("sent"); setBusy(false); return; }
    const { error } = await sb.auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) }); setBusy(false);
    if (error) setErr("That email and password do not match. Please try again."); else location.href = new URLSearchParams(location.search).get("next") || "/portal"; }
  return (<div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
    <aside className="relative hidden overflow-hidden border-r border-white/[.08] bg-[radial-gradient(ellipse_at_30%_20%,#1b2a44,#0b101a_65%)] p-12 lg:flex lg:flex-col lg:justify-between"><Link href="/" className="font-serif text-xl">Vargas Law Group</Link>
      <div><h1 className="max-w-md text-5xl leading-[1.05]">Your case, in one place.</h1><p className="mt-5 max-w-sm text-[#A6ABB3]">See where your case stands, send documents, message your team, and pay invoices securely.</p>
        <svg viewBox="0 0 400 140" className="mt-10 w-full max-w-md" aria-hidden><g fill="none" stroke="#B99A6A" strokeWidth="1.2" strokeDasharray="4 5"><path d="M30 110 Q130 0 340 40" /><path d="M70 130 Q180 30 340 40" /></g><circle cx="30" cy="110" r="4" fill="#F5F1E9" /><circle cx="70" cy="130" r="4" fill="#F5F1E9" /><circle cx="340" cy="40" r="6" fill="#35C98B" /></svg></div>
      <p className="text-xs text-[#6b717c]">Access is by invitation from the firm.</p></aside>
    <main className="flex items-center justify-center p-6"><form onSubmit={go} className="w-full max-w-sm"><span className="grid h-11 w-11 place-items-center rounded-xl border border-white/[.12] bg-white/5"><Lock size={18} strokeWidth={1.6} /></span>
      <h2 className="mt-6 text-4xl">{mode === "in" ? "Sign in" : "Reset your password"}</h2><p className="mt-2 text-sm text-[#8b919b]">{mode === "in" ? "Use the email the firm invited." : mode === "forgot" ? "We will email you a link to choose a new password." : ""}</p>
      {mode === "sent" ? <p className="mt-8 text-[#C9CDD3]">If that email has an account, a reset link is on its way.</p> : <div className="mt-8 space-y-4"><div><label className="lbl" htmlFor="email">Email</label><input id="email" className="input" name="email" type="email" required autoComplete="email" /></div>
        {mode === "in" && <div><div className="flex justify-between"><label className="lbl" htmlFor="pw">Password</label><button type="button" className="text-xs text-[#B99A6A]" onClick={() => setMode("forgot")}>Forgot password</button></div><input id="pw" className="input" name="password" type="password" required autoComplete="current-password" /></div>}
        {err && <p role="alert" className="text-sm text-err">{err}</p>}<button className="btn w-full justify-center" disabled={busy}>{busy ? "Please wait" : mode === "in" ? "Sign in" : "Send reset link"}</button></div>}
      {mode !== "in" && <button type="button" className="mt-6 text-sm text-[#A6ABB3]" onClick={() => setMode("in")}>Back to sign in</button>}
      <p className="mt-10 text-xs text-[#6b717c]">No account yet? Accounts are created by the firm. <Link className="underline" href="/contact">Contact us</Link>.</p></form></main></div>);
}
