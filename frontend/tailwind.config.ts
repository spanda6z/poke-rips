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
        poke: {
          yellow: "#FFCB05",
          red: "#EE1515",
          navy: "#003A70",
          bg: "#0B0F1A",
          surface: "#151C2C",
        },
      },
    },
  },
  plugins: [],
};
export default config;