/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html', 'src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#E0F7F5',
          200: '#B3EBE7',
          300: '#80DFD8',
          400: '#4DD3CA',
          500: '#00ADA0'
        },
        secondary: {
          100: '#F9F1FF',
          200: '#E4D4FF',
          300: '#C7A6FF',
          400: '#AA79FF',
          500: '#824DFF'
        }
      }
    }
  },
  plugins: []
}

