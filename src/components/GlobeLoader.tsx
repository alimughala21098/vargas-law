"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Globe = dynamic(() => import("./Globe"), { ssr: false });
export default function GlobeLoader() {
  const [ok, setOk] = useState(false);
  useEffect(() => { if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setOk(true); }, []);
  return ok ? <Globe /> : <div className="h-[460px] w-full rounded-full bg-[radial-gradient(circle,#202936,#101827_70%)] opacity-60 md:h-[600px]" aria-hidden />;
}
