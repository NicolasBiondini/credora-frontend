import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          primary: "#6B4EFF",
          light: "#8A73FF",
          dark: "#4C35B3",
        },
        blue: {
          primary: "#3B82F6",
          light: "#60A5FA",
          dark: "#1D4ED8",
        },
        green: {
          primary: "#10B981",
          light: "#34D399",
          dark: "#059669",
        },
        orange: {
          primary: "#F59E0B",
          light: "#FBBF24",
          dark: "#D97706",
        },
        neutral: {
          black: "#1A1A1A",
          gray: "#F5F5F5",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
