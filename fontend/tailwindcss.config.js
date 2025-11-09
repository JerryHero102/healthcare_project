/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // map custom CSS variables so you can use classes like 'bg-primary' or 'text-primary'
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)'
      }
    }
  },
  plugins: [],
}
