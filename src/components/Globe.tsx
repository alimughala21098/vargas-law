"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
const ll = (lat: number, lon: number, r = 1) => { const p = (90 - lat) * Math.PI / 180, t = (lon + 180) * Math.PI / 180; return new THREE.Vector3(-r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t)); };
const US = ll(38, -97);
const FROM = [ll(19.4, -99.1), ll(4.7, -74.1), ll(-12, -77), ll(-34.6, -58.4), ll(10.5, -66.9), ll(-23.5, -46.6)];
function Scene() {
  const g = useRef<THREE.Group>(null);
  useFrame((s, d) => { if (g.current) { g.current.rotation.y += d * 0.08; g.current.rotation.x += (s.pointer.y * 0.2 - g.current.rotation.x) * 0.05; } });
  const arcs = useMemo(() => FROM.map(a => { const m = a.clone().add(US).multiplyScalar(0.5).normalize().multiplyScalar(1.5); return new THREE.QuadraticBezierCurve3(a, m, US).getPoints(48); }), []);
  return (<group ref={g} rotation={[0.3, -1.6, 0]}>
    <mesh><sphereGeometry args={[1, 48, 48]} /><meshBasicMaterial color="#202936" wireframe transparent opacity={0.5} /></mesh>
    <mesh><sphereGeometry args={[0.995, 48, 48]} /><meshBasicMaterial color="#101827" /></mesh>
    {arcs.map((pts, i) => <line key={i}><bufferGeometry setFromPoints={pts as any} /><lineBasicMaterial color="#B99A6A" /></line>)}
    {[...FROM, US].map((p, i) => <mesh key={i} position={p}><sphereGeometry args={[0.02, 12, 12]} /><meshBasicMaterial color={i === FROM.length ? "#35C98B" : "#F5F1E9"} /></mesh>)}
  </group>);
}
export default function Globe() {
  return (<div className="h-[460px] w-full md:h-[600px]" aria-hidden><Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3.1], fov: 45 }}><Scene /></Canvas></div>);
}
