import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4ff",
          100: "#dfe9ff",
          200: "#b8d1ff",
          300: "#7aabff",
          400: "#3580ff",
          500: "#0a5cff",
          600: "#003ddb",
          700: "#0030b0",
          800: "#002990",
          900: "#002575",
          950: "#00174d",
        },
        earth: {
          50: "#faf6f0",
          100: "#f0e6d4",
          200: "#e0c9a6",
          300: "#cda871",
          400: "#bd8a49",
          500: "#a5713a",
          600: "#8d5a31",
          700: "#71452b",
          800: "#5e3a29",
          900: "#503226",
          950: "#2d1912",
        },
        mystic: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344",
        },
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(6, 182, 212, 0.8)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
