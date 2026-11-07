import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#101827", charcoal: "#111318", slate: "#202936",
        ivory: "#F5F1E9", soft: "#FAFAF8", bronze: "#B99A6A", muted: "#A6ABB3",
        ok: "#35C98B", warn: "#E5A64A", err: "#E46D6D",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
