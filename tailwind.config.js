/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './dashboard.html'
  ],
  theme: {
    extend: {
      colors: {
        'blue': {
          200: '#1F2743',
          300: '#1E293B',
          400: '#131B2E',
          500: '#151B31',
          800: '#101425'
        }
      }
    },
  },
  plugins: [],
}

