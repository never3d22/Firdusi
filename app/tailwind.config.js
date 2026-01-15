/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Premium black & gold palette
        bg: '#07070A',
        surface: '#0E0E13',
        surface2: '#14141C',
        gold: '#D4AF37',
        goldSoft: '#E6CF7A',
        // Backwards compatible tokens used across the app
        primary: '#D4AF37',
        secondary: '#0E0E13'
      }
    }
  },
  plugins: []
};
