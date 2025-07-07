import { fontFamily as _fontFamily } from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export const content = ['./index.html', 'src/**/*.{vue,ts,tsx}']
export const theme = {
  extend: {
    darkMode: 'media',
    fontFamily: {
      sans: ['"Noto Sans JP"', ..._fontFamily.sans],
    },
    maxWidth: {
      '7xl': '80rem', // 1280px
    },
    colors: {
      /* 基本パレット */
      primary: { 
        100: '#e5f9f8',
        200: '#b2f0ed',
        300: '#80e7e3',
        400: '#4dddd8',
        500: '#00ada0',
        600: '#00978e',
        700: '#007f78',
        800: '#006760',
        900: '#004d46'
      },
      secondary: {
        100: '#fff5d0',
        200: '#ffe09a',
        300: '#ffcb64',
        400: '#ffb42e',
        500: '#ff9d00'
      },

      /* ダーク用サーフェス */
      surface: {
        DEFAULT: '#1f2937',
        muted: '#374151',
        card: '#222b3c'
      },
      on: {
        surface: '#f3f4f6',
        surfaceHi: '#FFFFFF'
      },
    },
    screens: {
      'hover-hover': { raw: '(hover: hover)' }, // PC 判定
    },
  },
}
export const plugins = [require('@tailwindcss/typography')]

