/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D4AF37', // Gold
        secondary: '#1A1A1A', // Dark
        dark: '#121212',
        surface: '#1E1E1E',
        text: '#F5F5F5',
        muted: '#888888'
      }
    }
  },
  plugins: []
};
