/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#1a1a1a',
          secondary: '#2d2d2d',
          text: '#ffffff'
        },
        light: {
          primary: '#ffffff',
          secondary: '#f3f4f6',
          text: '#333333'
        }
      }
    },
  },
  plugins: [],
} 