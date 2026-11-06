import Link from "next/link";
export const Btn = ({ href, children }: { href: string; children: React.ReactNode }) => <Link href={href} className="glass inline-block rounded-full px-5 py-2.5 text-sm font-medium">{children}</Link>;
export function Nav() {
  return (<header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy/70 backdrop-blur"><nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 text-sm">
    <Link href="/" className="font-serif text-lg">Vargas Law Group</Link>
    <div className="hidden gap-6 md:flex"><Link href="/immigration-services">Immigration Services</Link><Link href="/contact">Contact</Link><Link href="/portal">Client Portal</Link></div>
    <Btn href="/book-consultation">Book a Consultation</Btn></nav></header>);
}
export const Footer = () => (<footer className="mt-24 border-t border-white/10 px-5 py-10 text-center text-xs text-muted">
  <p>General information only, not legal advice. Contact details pending firm confirmation.</p><p className="mt-2">© {new Date().getFullYear()} Vargas Law Group</p></footer>);
