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
        'browers-deep-purple': '#3A0E5F', // Color principal
        'browers-purple': '#5B0888', // Color secundario
        'browers-light-purple': '#7D39C4', // Acento en titulares y gráficos
        'browers-lavender': '#A44DFF', // Acento llamativo
        'browers-grey': '#8E8E8E', // Gris medio para texto sobre fondo morado
        'browers-dark-grey': '#555555', // Gris oscuro para texto sobre fondo claro
        'browers-light-grey': '#E3E3E3', // Fondo secundario
        'browers-white': '#FFFFFF', // Blanco para contraste (botones, logotipo)
        'browers-black': '#0C0C0C', // Negro absoluto para contraste fuerte
        'browers-charcoal': '#393939', // Gris muy oscuro
        'browers-steel-grey': '#717171', // Gris intermedio
        'browers-silver': '#AAAAAA', // Gris claro suave
      },
      screens: {
        'sm-max': { 'max':'640px'},
        'md-max': {'max':'768px'},
        'lg-max': {'max':'1024px'},
        'xl-max': {'max':'1280px'},
        '2xl-max': {'max':'1536px'},
      }
    },
  },
  plugins: [],
}
