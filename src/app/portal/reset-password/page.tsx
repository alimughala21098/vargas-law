"use client";
import { useState } from "react"; import { supabaseBrowser } from "@/lib/supabase/client";
export default function Reset() {
  const [msg, setMsg] = useState("");
  async function go(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const pw = String(new FormData(e.currentTarget).get("pw")); if (pw.length < 10) return setMsg("Use at least 10 characters."); const { error } = await supabaseBrowser().auth.updateUser({ password: pw }); if (error) setMsg("This link has expired. Request a new one."); else location.href = "/portal"; }
  return (<main className="mx-auto max-w-sm px-6 pt-32"><h1 className="text-4xl">Choose a new password</h1><form onSubmit={go} className="mt-8 space-y-4"><input className="input" name="pw" type="password" placeholder="New password (10+ characters)" required />{msg && <p role="alert" className="text-sm text-err">{msg}</p>}<button className="btn w-full justify-center">Save password</button></form></main>);
}
