/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arcane: {
          900: '#0a0a0f', 
          800: '#13131f', 
          400: '#4ade80', 
          500: '#a855f7', 
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', 'monospace', 'Consolas'],
      }
    },
  },
  plugins: [],
}