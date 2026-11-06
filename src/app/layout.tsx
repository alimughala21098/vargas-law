import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Vargas Law Group", description: "Immigration guidance for individuals, families, and businesses." };
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap" /></head><body>{children}</body></html>);
}
