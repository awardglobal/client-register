// module.exports = {
//   content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: '#0064fa',
      dark: '#41464c',
      divider: '#ededee',
      black: colors.black,
      white: colors.white,
      gray: colors.slate,
      green: colors.emerald,
      purple: colors.violet,
      yellow: colors.amber,
      pink: colors.fuchsia,
      blue: colors.blue,
      red: colors.red,
    },
    extend: {},
  },
  plugins: [],
}