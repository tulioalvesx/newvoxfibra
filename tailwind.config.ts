import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        newvox: {
          50: "#e0f8ff",
          100: "#b3edff",
          200: "#80e2ff",
          300: "#4dd7ff",
          400: "#26ceff",
          500: "#07d9fe",
          600: "#06b8d9",
          700: "#0597b4",
          800: "#04768f",
          900: "#03556a",
        }
      }
    },
  },
  plugins: [],
};
export default config;
