const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#4a654f',
          dark: '#384e3d',
          light: '#eaf2eb',
        },
        ivory: '#faf9f6',
        beige: '#f4dfcb',
        charcoal: '#1a1c1a',
        gold: '#c5a059',
        customBorder: '#c2c8c0',
      },
      fontFamily: {
        sans: ['var(--font-be-vietnam-pro)', 'sans-serif'],
        playfair: ['var(--font-playfair-display)', 'serif'],
      },
    },
  },
  plugins: [],
};
