/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts}"],
  theme: {
    extend: {
      colors: {
        velin: "#fbf9f4",
        encre: "#0a0e17",
        or: "#c59b27",
      },
      fontFamily: {
        display: ["Newsreader", "serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        none: "0",
      },
    },
  },
  plugins: [],
};
