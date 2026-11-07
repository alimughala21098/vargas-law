"use client";
import Link from "next/link"; import { useEffect, useState } from "react"; import { Arrow } from "./Nav";
export default function FloatingCTA({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const f = () => setOn(scrollY > 700); f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  return <Link href="/book-consultation" className={`btn fixed bottom-5 right-5 z-40 shadow-2xl transition-all duration-300 ${on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}>{label}<Arrow /></Link>;
}
