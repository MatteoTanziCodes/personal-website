/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "page-light": "#FAFAFA",
        "page-dark": "#0B0D10",
        "foreground-light": "#2D2D2D",
        "foreground-dark": "#EDEDED",
        "muted": "#9CA3AF",
        primary: "#6366F1", // Indigo for accents
      },
      fontFamily: {
        sans: ["Satoshi", "sans-serif"],
      },
      spacing: {
        header: '64px', // Adjust to match your navbar height
        footer: '64px', // Adjust to match your footer height
      },
    },
  },
  plugins: [],
};
