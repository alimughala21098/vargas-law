"use client";
import dynamic from "next/dynamic"; import { useEffect, useState } from "react";
const Globe = dynamic(() => import("./Globe"), { ssr: false });
export default function GlobeLoader() {
  const [mode, setMode] = useState<"static" | "3d">("static"); const [wide, setWide] = useState(true);
  useEffect(() => { const rm = matchMedia("(prefers-reduced-motion: reduce)").matches; const ok = (() => { try { return !!document.createElement("canvas").getContext("webgl"); } catch { return false; } })(); if (!rm && ok) setMode("3d"); setWide(innerWidth > 900); }, []);
  return (<div className="relative -mx-4 h-[460px] md:-mx-10 md:h-[680px]" aria-label="Globe showing routes from Latin America to the United States" role="img">
    {mode === "3d" ? <Globe labels={wide} /> : <div className="absolute inset-8 rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_30%,#1b2638,#0b101a_70%)]" />}</div>);
}
