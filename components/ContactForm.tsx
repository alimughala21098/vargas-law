"use client";
import { useState } from "react";
export default function ContactForm() {
  const [s, set] = useState("idle");
  async function go(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); set("busy"); const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))) }); set(r.ok ? "done" : "err"); }
  if (s === "done") return <div className="panel p-8"><h3 className="font-serif text-2xl">Message received</h3><p className="mt-2 text-[#A6ABB3]">The firm will reply using your preferred contact method.</p></div>;
  return (<form onSubmit={go} className="panel grid gap-4 p-6 md:grid-cols-2"><div><label className="lbl">Full name</label><input className="input" name="name" required /></div><div><label className="lbl">Email</label><input className="input" type="email" name="email" required /></div>
    <div><label className="lbl">Phone (optional)</label><input className="input" name="phone" /></div><div><label className="lbl">What is this about?</label><select className="input" name="category">{["General question", "Investor visas", "EB-1 / O-1", "Family petitions", "Work visas", "Asylum", "Citizenship", "Deportation defense"].map(c => <option key={c}>{c}</option>)}</select></div>
    <div><label className="lbl">Preferred contact method</label><select className="input" name="preferred_contact"><option>Email</option><option>Phone</option><option>WhatsApp</option></select></div><div><label className="lbl">Preferred language</label><select className="input" name="language"><option value="en">English</option><option value="es">Español</option></select></div>
    <div className="md:col-span-2"><label className="lbl">Message</label><textarea className="input min-h-32" name="message" required /><p className="mt-2 text-xs text-[#8b919b]">Please do not include sensitive immigration details here. Share those after you are invited to the secure portal.</p></div>
    {s === "err" && <p role="alert" className="text-err md:col-span-2">We could not send your message. Please try again.</p>}<button className="btn md:col-span-2 md:w-fit" disabled={s === "busy"}>{s === "busy" ? "Sending" : "Send message"}</button></form>);
}
