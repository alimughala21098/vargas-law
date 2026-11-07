import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: { default: "Vargas Law Group", template: "%s | Vargas Law Group" }, description: "Immigration guidance for individuals, families, and businesses." };
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Hanken+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" /><noscript><style>{`.rv{opacity:1!important;transform:none!important}`}</style></noscript></head><body>{children}</body></html>);
}
