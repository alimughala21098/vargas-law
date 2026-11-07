"use client";
import { useEffect, useRef } from "react";
export default function Reveal({ children, className = "", delay = 0, as: T = "div" }: { children: React.ReactNode; className?: string; delay?: number; as?: any }) {
  const r = useRef<HTMLElement>(null);
  useEffect(() => { const el = r.current; if (!el) return; const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.12 }); io.observe(el); return () => io.disconnect(); }, []);
  return <T ref={r} className={`rv ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</T>;
}
