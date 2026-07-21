/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D4AF37',
        secondary: '#FFFFFF',
        dark: '#1A1A1A',
        light: '#F9F9F9',
      },
    },
  },
  plugins: [],
}