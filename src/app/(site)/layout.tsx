import Nav from "@/components/Nav"; import Footer from "@/components/Footer"; import Cursor from "@/components/Cursor"; import FloatingCTA from "@/components/FloatingCTA"; import { getLang, t } from "@/lib/locale";
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const lang = getLang(); const L = t(lang);
  return (<><a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black">Skip to content</a><Nav lang={lang} L={L} /><main id="main">{children}</main><Footer lang={lang} L={L} /><FloatingCTA label={L.book} /><Cursor /></>);
}
