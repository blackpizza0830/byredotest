import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        byredo: {
          black: "#0A0A0A",
          white: "#F5F5F0",
          cream: "#EDE8E0",
          gray: {
            100: "#F0EFEB",
            200: "#DEDBD4",
            300: "#C4C1B8",
            400: "#9E9B93",
            500: "#6E6B64",
            600: "#4A4842",
            700: "#2E2D29",
          },
          gold: "#B8A88A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      letterSpacing: {
        widest: "0.3em",
        ultra: "0.5em",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },
    },
  },
  plugins: [],
};

export default config;
