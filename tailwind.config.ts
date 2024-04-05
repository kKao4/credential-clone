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
        "gray-main": "rgb(50,54,57)",
        "gray-secondary": "rgb(82,86,89)",
        "blue-main": "rgb(138,180,248)",
      },
      transitionDuration: {
        400: "400ms",
        1200: "1200ms",
      },
    },
    fontSize: {
      "0.75": "0.75rem",
      "0.8": "0.8rem",
      "0.875": "0.875rem",
      "1": "1rem",
      "1.15": "1.15rem",
      "1.25": "1.25rem",
    },
  },
  plugins: [],
};
export default config;
