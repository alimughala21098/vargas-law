"use client";
import { useState } from "react"; import { Plus } from "lucide-react";
export default function FAQ({ items }: { items: { question: string; answer: string }[] }) {
  const [o, setO] = useState<number | null>(0);
  return (<div className="divide-y divide-white/10 border-y border-white/10">{items.map((f, i) => <div key={i}><button className="flex w-full items-center justify-between gap-6 py-5 text-left" aria-expanded={o === i} onClick={() => setO(o === i ? null : i)}><span className="font-serif text-xl">{f.question}</span><Plus size={18} className={`shrink-0 transition-transform duration-300 ${o === i ? "rotate-45" : ""}`} /></button>
    <div className={`grid transition-all duration-300 ${o === i ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}><p className="overflow-hidden text-[#A6ABB3]">{f.answer}</p></div></div>)}</div>);
}
