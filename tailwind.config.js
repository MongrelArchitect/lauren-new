/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "active": "#ff0000",
      },
      gridTemplateColumns: {
        "gallery": "repeat(auto-fill, minmax(160px, 1fr))",
      },
    },
  },
  plugins: [],
}

