/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', 'src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e0faf9',
          100: '#b3f0ee',
          200: '#80e5e3',
          300: '#4ddad8',
          400: '#26d1cf',
          500: '#00ADB5',
          600: '#009ca3',
          700: '#00868c',
          800: '#006f75',
          900: '#004f52',
        },
        secondary: {
          100: '#fff5d0',
          500: '#F9C74F',
        },
      },
      screens: {
        'hover-hover': { raw: '(hover: hover)' }, // PC 判定
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

