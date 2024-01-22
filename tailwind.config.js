/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "sides": "-5px 0 5px 0px rgba(0, 0, 0, 0.4), 5px 0 5px 0px rgba(0, 0, 0, 0.4)",
      },
      colors: {
        "brand-black": "#333333",
        "brand-blue": "#0066cc",
        "brand-canvas": "#f9f7f3",
        "brand-dark-gray": "#949aa1",
        "brand-gray": "#e5e7eb",
        "brand-light-gray": "#f2f3f5",
        "brand-orange": "#ff6600",
        "brand-purple": "#8a2be2",
        "brand-red": "#ee0000",
        "brand-yellow": "#d6bf0f",
        "brand-white": "#fdfdfd",
      },
      gridTemplateColumns: {
        "gallery": "repeat(auto-fill, minmax(160px, 1fr))",
      },
    },
  },
  plugins: [],
}

