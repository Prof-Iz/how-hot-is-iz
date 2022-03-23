const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.svelte', './src/**/*.css'],
  darkMode: true,
  daisyui: {
    themes: ['luxury']
  },
  theme: {
    colors: {
      white: colors.white,
      gray: colors.warmGray,
      'svelte-prime': '#ff5030',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("daisyui")],
}