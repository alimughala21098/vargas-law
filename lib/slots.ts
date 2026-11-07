// Default hours until the firm confirms its real schedule. Edit here or replace with DB-driven rules.
export const FIRM_TZ = "America/New_York";
export const HOURS = { start: 9, end: 17, stepMin: 30, days: [1, 2, 3, 4, 5] };
export const TYPES = [{ id: "initial", name: "Initial consultation", min: 30 }, { id: "review", name: "Case review", min: 30 }, { id: "urgent", name: "Urgent: removal proceedings", min: 30 }];
export function zonedToUtc(y: number, mo: number, d: number, h: number, mi: number, tz: string) {
  const g = Date.UTC(y, mo - 1, d, h, mi);
  const p: any = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(new Date(g)).map(x => [x.type, x.value]));
  return new Date(g - (Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - g));
}
export function slotsFor(date: string): Date[] {
  const [y, m, d] = date.split("-").map(Number); if (!y || !m || !d) return [];
  if (!HOURS.days.includes(new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay())) return [];
  const out: Date[] = []; for (let min = HOURS.start * 60; min < HOURS.end * 60; min += HOURS.stepMin) out.push(zonedToUtc(y, m, d, Math.floor(min / 60), min % 60, FIRM_TZ));
  return out.filter(s => +s > Date.now() + 3600e3);
}
