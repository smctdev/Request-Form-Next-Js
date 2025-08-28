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
    extend: {
      colors: {
        blue: colors.blue,
        red: colors.red,
        gray: colors.gray,
        black: colors.black,
        white: colors.white,
      },
     },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: ["light", "dark"], // keep DaisyUI themes available
  },
};