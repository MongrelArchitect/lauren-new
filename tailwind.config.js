/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-red": "#ee0000",
        "brand-black": "#333333",
        "brand-white": "#fdfdfd",
      },
      gridTemplateColumns: {
        "gallery": "repeat(auto-fill, minmax(160px, 1fr))",
      },
    },
  },
  plugins: [],
}

