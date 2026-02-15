/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,css,scss,less,sass}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // Replace with your font choice
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },

};
