"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { LAND_MASK } from "@/lib/landmask";
const ll = (lat: number, lon: number, r = 1) => { const p = (90 - lat) * Math.PI / 180, t = (lon + 180) * Math.PI / 180; return new THREE.Vector3(-r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t)); };
const CITIES = [{ n: "Bogotá", la: 4.7, lo: -74.1, tag: "Consultation booked", dx: -150, dy: 40 }, { n: "Mexico City", la: 19.4, lo: -99.1, tag: "Documents received", dx: -105, dy: -58 }, { n: "Lima", la: -12, lo: -77, tag: "Receipt number added", dx: -150, dy: 60 }, { n: "Miami", la: 25.8, lo: -80.2, tag: "Case filed", dx: 70, dy: -70 }];
const HUB = ll(25.8, -80.2);
const bits = typeof atob !== "undefined" ? Uint8Array.from(atob(LAND_MASK), c => c.charCodeAt(0)) : new Uint8Array();
const isLand = (lat: number, lon: number) => { const r = Math.min(89, Math.max(0, Math.round((89 - lat) / 2))), c = Math.min(179, Math.max(0, Math.round((lon + 179) / 2))); const i = r * 180 + c; return !!(bits[i >> 3] & (1 << (i & 7))); };
function Dots() {
  const geo = useMemo(() => { const pts: number[] = []; const N = 14000, g = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = g * i; const lat = Math.asin(y) * 180 / Math.PI; const lon = (Math.atan2(rad * Math.sin(th), rad * Math.cos(th)) * 180 / Math.PI);
      const v = ll(lat, lon); if (isLand(lat, lon)) pts.push(v.x, v.y, v.z); }
    const b = new THREE.BufferGeometry(); b.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); return b; }, []);
  return <points geometry={geo}><pointsMaterial color="#d9d3c4" size={0.0135} sizeAttenuation transparent opacity={0.8} /></points>;
}
function Arc({ from, i }: { from: THREE.Vector3; i: number }) {
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(from, from.clone().add(HUB).multiplyScalar(0.5).normalize().multiplyScalar(1.4), HUB), [from]);
  const pts = useMemo(() => curve.getPoints(60), [curve]); const dot = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (dot.current) dot.current.position.copy(curve.getPoint(((clock.elapsedTime * 0.12 + i * 0.25) % 1))); });
  return (<><Line points={pts} color="#d4b27a" lineWidth={1.6} /><mesh ref={dot}><sphereGeometry args={[0.014, 10, 10]} /><meshBasicMaterial color="#FAFAF8" /></mesh></>);
}
function Scene({ labels }: { labels: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ pointer }) => { if (g.current) { g.current.rotation.y += (pointer.x * 0.35 - g.current.rotation.y) * 0.04; g.current.rotation.x += (0.38 - pointer.y * 0.2 - g.current.rotation.x) * 0.04; } });
  return (<group ref={g} rotation={[0.38, 0, 0]}>
    <mesh><sphereGeometry args={[0.992, 64, 64]} /><meshBasicMaterial color="#0e1522" /></mesh>
    <Dots />
    {CITIES.slice(0, 3).map((c, i) => <Arc key={c.n} from={ll(c.la, c.lo)} i={i} />)}
    {CITIES.map((c, i) => <group key={c.n} position={ll(c.la, c.lo)}><mesh><sphereGeometry args={[0.02, 12, 12]} /><meshBasicMaterial color={i === 3 ? "#35C98B" : "#FAFAF8"} /></mesh>
      {labels && <Html zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}><div style={{ position: "relative" }}><svg width="1" height="1" style={{ overflow: "visible", position: "absolute", left: 0, top: 0 }}><line x1="0" y1="0" x2={c.dx} y2={c.dy} stroke="#35C98B" strokeWidth="1.2" /></svg><span className="tag" style={{ position: "absolute", left: c.dx - (c.dx < 0 ? 140 : 0), top: c.dy - 10, width: 140, textAlign: c.dx < 0 ? "right" : "left", background: "transparent", boxShadow: "none", padding: 0 }}><span className="tag">{c.tag}</span></span></div></Html>}</group>)}
  </group>);
}
export default function Globe({ labels = true }: { labels?: boolean }) {
  return <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0, 3.9], fov: 40 }} gl={{ antialias: true, alpha: true }}><Scene labels={labels} /></Canvas>;
}
