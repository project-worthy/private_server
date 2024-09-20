/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,js,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background))",
        primary: "rgba(var(--primary))",
        secondary: "rgba(var(--secondary))",
        highlight: "rgba(var(--highlight)) !important",
        blend: "rgba(var(--blend))",
      },
    },
  },
  plugins: [],
};
