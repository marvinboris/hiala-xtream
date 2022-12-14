/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Display', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          50: '#eef8e8',
          100: '#d5edc5',
          200: '#b9e19f',
          300: '#9dd578',
          400: '#86cc59',
          500: '#70c33a',
          600: '#62B332',
          700: '#4c9f28',
          800: '#378b1e',
          900: '#006909',
        },
        secondary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      }
    },
  },
  plugins: [],
}
