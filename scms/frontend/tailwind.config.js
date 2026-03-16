/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkSidebar: '#0f172a',
        darkBg: '#0b1120',
        darkCard: '#1e293b',
        primary: {
          light: '#3b82f6', // blue
          dark: '#06b6d4',  // cyan
        }
      }
    },
  },
  plugins: [],
}
