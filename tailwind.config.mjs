import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: { /* your customizations */ },
  },
  plugins: [
    daisyui,
  ],
};