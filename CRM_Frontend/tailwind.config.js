/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        uit: "#00693E",
        endColor: "#9de1be",
        uitLight: "#F2FFEF",
      },
    },
  },
  plugins: [],
};
