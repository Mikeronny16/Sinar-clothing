import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Static brand colors (always the same)
        forest: "#0A1A0F",
        "forest-light": "#0F2415",
        "forest-mid": "#122B19",
        pink: "#FF1F6E",
        "pink-glow": "#FF1F6E33",
        emerald: "#00FF88",
        "emerald-dim": "#00FF8822",
        cream: "#F5F0E8",
        muted: "#7A8F7D",
        hairline: "#1C3020",

        // CSS-variable-based theming
        bg: "var(--color-bg)",
        "bg-mid": "var(--color-bg-mid)",
        "bg-card": "var(--color-bg-card)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
        "text-sub": "var(--color-text-sub)",
        "text-muted": "var(--color-text-muted)",
        border: "var(--color-border)",
        accent: "#FF1F6E",
        "green-brand": "#2D5A3D",
        "green-light": "#3D7A52",
        "cream-warm": "#FAF7F2",
      },
      fontFamily: {
        serif: ["'DM Serif Display'", "'Playfair Display'", "Georgia", "serif"],
        "serif-alt": ["'Playfair Display'", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mm: ["'Noto Sans Myanmar'", "Pyidaungsu", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 20px rgba(0,0,0,0.4)",
        pink: "0 0 30px rgba(255,31,110,0.4)",
        "pink-sm": "0 0 15px rgba(255,31,110,0.3)",
        glow: "0 0 40px rgba(0,255,136,0.15)",
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
