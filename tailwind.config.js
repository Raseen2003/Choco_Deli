/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chocolate: {
          50: '#fef9f5',
          100: '#fdf1e8',
          200: '#fbe0cc',
          300: '#f7c7a5',
          400: '#f1a171',
          500: '#ea7f42',
          600: '#dd6228',
          700: '#b84420',
          800: '#93351f',
          900: '#752f1b',
          950: '#48190d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], // elegant vibes
      }
    },
  },
  plugins: [],
}
