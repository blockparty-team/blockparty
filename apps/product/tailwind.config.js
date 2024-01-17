const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cutive Mono', 'sans-serif'],
        logo: ['Silkscreen', 'sans-serif'],
      },
      colors: {
        primary: {
          100: '#cdd1dc',
          200: '#9ca3ba',
          300: '#6a7597',
          400: '#394775',
          500: '#071952',
          600: '#061442',
          700: '#040f31',
          800: '#030a21',
          900: '#010510',
        },
        secondary: {
          100: '#cee6ea',
          200: '#9ccdd5',
          300: '#6bb5bf',
          400: '#399caa',
          500: '#088395',
          600: '#066977',
          700: '#054f59',
          800: '#03343c',
          900: '#021a1e',
        },
        tertiary: {
          100: '#d7ecec',
          200: '#aedad9',
          300: '#86c7c5',
          400: '#5db5b2',
          500: '#35a29f',
          600: '#2a827f',
          700: '#20615f',
          800: '#154140',
          900: '#0b2020',
        },
        yellow: {
          100: '#fcfdec',
          200: '#fafcd9',
          300: '#f7fac7',
          400: '#f5f9b4',
          500: '#f2f7a1',
          600: '#c2c681',
          700: '#919461',
          800: '#616340',
          900: '#303120',
        },
      },
    },
  },
  plugins: [],
};
