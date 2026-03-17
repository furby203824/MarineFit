/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        marine: {
          red: 'oklch(0.35 0.15 25 / <alpha-value>)',
          gold: 'oklch(0.87 0.17 85 / <alpha-value>)',
          dark: 'oklch(0.15 0 0 / <alpha-value>)',
          light: 'oklch(0.98 0.005 250 / <alpha-value>)',
        },
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
};
