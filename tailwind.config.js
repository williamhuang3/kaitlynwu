/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          light: "#9f99e3",
          DEFAULT: "#7b77be",
          dark: "#58569a",
          deep: "#363877",
          night: "#101c56",
        },
      },
    },
  },
  plugins: [],
};
