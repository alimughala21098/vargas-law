import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
function key(): Buffer {
  const b64 = process.env.PAYMENT_ENCRYPTION_KEY;
  if (!b64) throw new Error("PAYMENT_ENCRYPTION_KEY is not set. Credentials cannot be saved until it is configured.");
  const k = Buffer.from(b64, "base64");
  if (k.length !== 32) throw new Error("PAYMENT_ENCRYPTION_KEY must decode to 32 bytes.");
  return k;
}
export function encryptSecret(plain: string): string {
  const iv = randomBytes(12); const c = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), enc].map(b => b.toString("base64")).join(".");
}
export function decryptSecret(blob: string): string {
  const [iv, tag, enc] = blob.split(".").map(s => Buffer.from(s, "base64"));
  const d = createDecipheriv("aes-256-gcm", key(), iv); d.setAuthTag(tag);
  return Buffer.concat([d.update(enc), d.final()]).toString("utf8");
}
export const mask = (s: string) => (s.length > 8 ? `${s.slice(0,3)}••••${s.slice(-2)}` : "••••");
