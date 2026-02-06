/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-light": "#4ADE80", // Hijau Muda
        "primary-dark": "#166534", // Hijau Tua
        "neutral-bg": "#F9FAFB", // Putih keabuan (background)
      },
    },
  },
  plugins: [],
};
