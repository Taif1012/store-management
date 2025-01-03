/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#1a1a1a',
          200: '#2d2d2d',
          300: '#404040',
          400: '#535353',
          500: '#666666',
          600: '#808080',
          700: '#999999',
          800: '#b3b3b3',
          900: '#cccccc',
        }
      }
    },
  },
  plugins: [],
}