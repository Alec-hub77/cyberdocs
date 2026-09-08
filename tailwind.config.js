/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050805",
        surface: "#0b120d",
        raised: "#0f1a12",
        line: "#1c2e20",
        line2: "#25412c",
        term: {
          50: "#eafff1",
          100: "#c8ffd9",
          200: "#93ffb3",
          300: "#5cf98c",
          400: "#33e86b",
          500: "#1fce55",
          600: "#16a844",
          700: "#137f37",
          800: "#0f5f2b",
          900: "#0a3f1e",
        },
        amber: "#ffb52e",
        rose: "#ff5c5c",
        muted: "#6e8f78",
        ink: "#d7ffe4",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        scan: "repeating-linear-gradient(0deg, rgba(51,232,107,0.035) 0px, rgba(51,232,107,0.035) 1px, transparent 1px, transparent 3px)",
        grid: "linear-gradient(rgba(51,232,107,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(51,232,107,0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(51,232,107,0.25), 0 0 24px -4px rgba(51,232,107,0.35)",
        glowSm: "0 0 0 1px rgba(51,232,107,0.2), 0 0 12px -4px rgba(51,232,107,0.3)",
      },
      keyframes: {
        blink: { "0%,49%": { opacity: 1 }, "50%,100%": { opacity: 0 } },
        flicker: {
          "0%,19%,21%,23%,25%,54%,56%,100%": { opacity: 1 },
          "20%,24%,55%": { opacity: 0.55 },
        },
        rise: {
          "0%": { transform: "translateY(6px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        flicker: "flicker 4s linear infinite",
        rise: "rise 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
