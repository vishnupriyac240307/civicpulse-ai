/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#d9e2ec',
          500: '#1b365d',
          800: '#0f2038',
          900: '#0a1728',
        },
        civic: {
          blue: '#1e40af',
          sky: '#0284c7',
          emerald: '#059669',
          amber: '#d97706',
          rose: '#e11d48',
        }
      }
    },
  },
  plugins: [],
}
