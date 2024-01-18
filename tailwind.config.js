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
        "brand-gray": "#e5e7eb",
        "brand-light-gray": "#f2f3f5",
        "brand-dark-gray": "#949aa1",
        "brand-white": "#fdfdfd",
      },
      gridTemplateColumns: {
        "gallery": "repeat(auto-fill, minmax(160px, 1fr))",
      },
      transitionProperty: {
        "max-height": "max-height",
      },
    },
  },
  plugins: [],
}

