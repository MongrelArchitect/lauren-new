/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "sides": "-5px 0 5px -5px rgba(0, 0, 0, 0.8), 5px 0 5px -5px rgba(0, 0, 0, 0.8)",
      },
      colors: {
        "brand-red": "#ee0000",
        "brand-black": "#333333",
        "brand-canvas": "#f9f7f3",
        "brand-gray": "#e5e7eb",
        "brand-light-gray": "#f2f3f5",
        "brand-dark-gray": "#949aa1",
        "brand-white": "#fdfdfd",
      },
      gridTemplateColumns: {
        "gallery": "repeat(auto-fill, minmax(160px, 1fr))",
      },
    },
  },
  plugins: [],
}

