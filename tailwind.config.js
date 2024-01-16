/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "navside": "-2px 0px 2px 0px rgba(0,0,0,0.3)",
        "navtop": "0px 2px 2px 0px rgba(0,0,0,0.3)",
      },
      colors: {
        "active": "#ff0000",
      },
    },
  },
  plugins: [],
}

