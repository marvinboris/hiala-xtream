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
          50: "#e3f6ff",
          100: "#b8e8ff",
          200: "#8adafe",
          300: "#5dccf9",
          400: "#41c1f4",
          500: "#37b7ec",
          600: "#2ea8d8",
          700: "#1f93bd",
          800: "#0e80a3",
          900: "#005f76"
        },
        secondary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#2C2C2C',
          800: '#242424',
          900: '#111314',
        },
        green: "#61AD32",
        teal: "#03C859"
      }
    },
    linearBorderGradients: theme => ({
      colors: theme('colors'),
    }),
  },
  plugins: [
    require('tailwindcss-border-gradients')(),
  ],
}
