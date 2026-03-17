/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        marine: {
          red: '#8B0000', // Scarlet
          gold: '#FFD700', // Gold
          dark: '#1a1a1a',
          light: '#f8f9fa',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        'plex-mono': ['"IBM Plex Mono"', 'monospace'],
        'plex-sans': ['"IBM Plex Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
