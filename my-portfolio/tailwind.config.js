/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#14B8A6",   // Teal
          secondary: "#6366F1", // Indigo
        },
      },
    },
    plugins: [],
  }
  