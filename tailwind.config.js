/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#F8FAFC",
        "surface-pure": "#FFFFFF",
        "surface-muted": "#F1F5F9",
        "surface-dark": "#0B0F17",
        primary: "#0B0F17",
        "primary-hover": "#1E293B",
        accent: "#FF3815",
        "accent-glow": "rgba(255, 56, 21, 0.12)",
        "on-surface": "#0B0F17",
        "on-surface-muted": "#64748B",
        "on-surface-subtle": "#94A3B8",
        "border-subtle": "#E2E8F0",
        "border-dark": "#1E293B",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        widest: "0.18em",
      },
    },
  },
  plugins: [],
};
