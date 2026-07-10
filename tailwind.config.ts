import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Static brand colors (always the same)
        forest: "#06150C",
        "forest-light": "#0F2D1C",
        "forest-mid": "#1D3F2C",
        pink: "#C28773",
        "pink-glow": "#C2877333",
        coral: "#C28773",
        "coral-deep": "#A76F5B",
        rosegold: "#C28773",
        blush: "#fbdbd9",
        gold: "#fbdbd9",
        plum: "#0B2014",
        ivory: "#fbdbd9",
        emerald: "#0F3B24",
        "emerald-dim": "#0F3B2418",
        cream: "#fbdbd9",
        muted: "#B39E9A",
        hairline: "#D1E2D7",

        // CSS-variable-based theming
        bg: "var(--color-bg)",
        "bg-mid": "var(--color-bg-mid)",
        "bg-card": "var(--color-bg-card)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
        "text-sub": "var(--color-text-sub)",
        "text-muted": "var(--color-text-muted)",
        border: "var(--color-border)",
        accent: "#C08A78",
        "green-brand": "#2D5A3D",
        "green-light": "#3D7A52",
        "cream-warm": "#FAF6EF",
      },
      fontFamily: {
        serif: ["'Bricolage Grotesque'", "Inter", "system-ui", "sans-serif"],
        "serif-alt": ["'Bricolage Grotesque'", "Inter", "sans-serif"],
        display: ["'Bricolage Grotesque'", "Inter", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mm: ["'Noto Sans Myanmar'", "Pyidaungsu", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 20px rgba(0,0,0,0.4)",
        pink: "0 10px 40px rgba(192,138,120,0.35)",
        "pink-sm": "0 6px 20px rgba(192,138,120,0.28)",
        glow: "0 0 40px rgba(94,155,118,0.15)",
        editorial: "0 8px 60px rgba(0,0,0,0.25)",
        "editorial-dark": "0 8px 60px rgba(0,0,0,0.6)",
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        float: "float 3s ease-in-out infinite",
        pulse2: "pulse2 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
