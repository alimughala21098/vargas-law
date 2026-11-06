"use client";
import { useState } from "react"; import { Nav, Footer } from "@/components/Nav";
export default function Book() {
  const [state, set] = useState<string>("idle");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); set("busy"); const body = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    set(r.ok ? "done" : (await r.json()).error ?? "Something went wrong");
  }
  if (state === "done") return (<><Nav /><main className="mx-auto max-w-xl px-5 pt-32"><h1 className="font-serif text-4xl">Request received</h1><p className="mt-4 text-muted">The firm will confirm your consultation time by email. Your request is not a confirmed appointment yet.</p></main></>);
  return (<><Nav /><main className="mx-auto max-w-xl px-5 pt-32"><h1 className="font-serif text-5xl">Book a Consultation</h1>
    <form onSubmit={submit} className="mt-8 space-y-4">
      <label className="block">Full name<input name="name" required /></label><label className="block">Email<input type="email" name="email" required /></label>
      <label className="block">Meeting type<select name="mode"><option value="video">Video</option><option value="phone">Phone</option><option value="in_person">In person</option></select></label>
      <label className="block">Language<select name="language"><option value="en">English</option><option value="es">Español</option></select></label>
      <label className="block">Preferred date and time<input type="datetime-local" name="when" required /></label>
      {state !== "idle" && state !== "busy" && <p role="alert" className="text-err">{state}</p>}
      <button disabled={state === "busy"} className="glass rounded-full px-6 py-3">{state === "busy" ? "Sending…" : "Request consultation"}</button></form></main><Footer /></>);
}
