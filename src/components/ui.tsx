export const Title = ({ crumb, children, right }: { crumb?: string; children: React.ReactNode; right?: React.ReactNode }) => (<div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div>{crumb && <p className="mb-2 text-sm text-[#8b919b]">{crumb}</p>}<h1 className="text-4xl sm:text-5xl">{children}</h1></div>{right}</div>);
export const Stat = ({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) => (<div className="panel p-5"><p className="text-sm text-[#A6ABB3]">{label}</p><p className="num mt-3 text-4xl font-light">{value}</p>{note && <p className="mono mt-2 text-xs text-[#6b717c]">{note}</p>}</div>);
export const Empty = ({ children }: { children: React.ReactNode }) => <div className="panel p-8 text-center text-sm text-[#8b919b]">{children}</div>;
export const stageLabel = (s: string) => s.replace(/_/g, " ").replace(/^\w/, c => c.toUpperCase());
export const tone = (s: string) => (["approved", "paid", "completed", "confirmed", "submitted", "active"].includes(s) ? "ok" : ["pending", "open", "requested", "assigned", "revision_requested"].includes(s) ? "warn" : ["rejected", "canceled", "void", "suspended", "error"].includes(s) ? "err" : "");
export const Badge = ({ s }: { s: string }) => <span className={`badge ${tone(s)}`}>{stageLabel(s)}</span>;
export const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-");
export const fmtDT = (d: string) => new Date(d).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
export const money = (m: number, c = "USD") => `${(m / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })} ${c}`;
