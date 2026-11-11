/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FFFFFF",
        mist: "#CACACA",
        surface: "#FAFAFB",
        obsidian: "#1A1A1D",
        cardBorder: "#E5E7EB",
        subtle: "#666666",
        accentGreen: "#22c55e",
        background: "#FFFFFF",
        foreground: "#0A0A0C",
        primary: {
          DEFAULT: "#111111",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F4F4F5",
          foreground: "#111111",
        },
        border: "#E5E7EB",
        muted: {
          DEFAULT: "#F4F4F5",
          foreground: "#666666",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "'Syne'", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
