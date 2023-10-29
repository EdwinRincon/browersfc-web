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
      screens: {
        'sm-max': { 'max':'640px'},
        // => @media (max-width: 640px) { ... }
  
        'md-max': {'max':'768px'},
        // => @media (max-width: 768px) { ... }
  
        'lg-max': {'max':'1024px'},
        // => @media (max-width: 1024px) { ... }
  
        'xl-max': {'max':'1280px'},
        // => @media (max-width: 1280px) { ... }
  
        '2xl-max': {'max':'1536px'},
        // => @media (max-width: 1536px) { ... }
      }
    },
  },
  plugins: [],
}

