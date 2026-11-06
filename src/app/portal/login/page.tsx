"use client";
import { useState } from "react"; import { supabaseBrowser } from "@/lib/supabase/client";
export default function Login() {
  const [err, setErr] = useState("");
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    if (error) setErr("Invalid email or password."); else window.location.href = new URLSearchParams(location.search).get("next") || "/portal";
  }
  return (<main className="mx-auto max-w-sm px-5 pt-32"><h1 className="font-serif text-4xl">Client Portal</h1><p className="mt-2 text-sm text-muted">Access is by invitation only.</p>
    <form onSubmit={go} className="mt-8 space-y-4"><input name="email" type="email" placeholder="Email" required /><input name="password" type="password" placeholder="Password" required />
      {err && <p role="alert" className="text-err">{err}</p>}<button className="glass w-full rounded-full py-3">Sign in</button></form></main>);
}
