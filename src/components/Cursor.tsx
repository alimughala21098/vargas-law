"use client";
import { useEffect, useRef } from "react";
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null), ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia("(pointer:fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0, y = 0, rx = 0, ry = 0, raf = 0; dot.current!.style.opacity = ring.current!.style.opacity = "1";
    const mv = (e: MouseEvent) => { x = e.clientX; y = e.clientY; ring.current!.classList.toggle("hot", !!(e.target as HTMLElement).closest("a,button,[data-cursor]")); };
    const loop = () => { rx += (x - rx) * 0.16; ry += (y - ry) * 0.16; dot.current!.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; ring.current!.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; raf = requestAnimationFrame(loop); };
    addEventListener("mousemove", mv); loop(); return () => { removeEventListener("mousemove", mv); cancelAnimationFrame(raf); };
  }, []);
  return (<><div ref={ring} className="cur-ring" style={{ opacity: 0 }} aria-hidden /><div ref={dot} className="cur-dot" style={{ opacity: 0 }} aria-hidden /></>);
}
