/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol'
        ]
      },
      colors: {
        'browers-purple': '#5B0888',
        'browers-blue': '#713ABE',
        'browers-grey': '#9D76C1',
        'browers-light-grey': '#E5CFF7',
      },
    },
  },
  plugins: [],
}

