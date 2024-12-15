/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      georgia: ["Georgia", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "contact-texture":
          "url('https://img.freepik.com/free-vector/linear-flat-abstract-lines-pattern_23-2148940824.jpg?w=740&t=st=1711800178~exp=1711800778~hmac=8860e924c082a65a36544987f99616e5432ff44b3e2fee79c7f71a4b40d84071')",
      },
      colors: {
        custom: {
          primary: "#008170",
          secondary: "#015152",
          tertiary: "#232D3F",
          quaternary: "#0F0F0F",
        },
      },
    },
  },
  plugins: [],
};
