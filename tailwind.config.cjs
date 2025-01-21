/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  safelist: [{ pattern: /^col-/ }],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-bootstrap-grid")({
      generateContainer: false,
      gridGutterWidth: "2rem",
      gridGutters: {
        1: "0.25rem",
        2: "0.5rem",
        3: "1rem",
        4: "1.5rem",
        5: "3rem",
      },
    }),
    require('daisyui')
  ],
  daisyui: {
    themes: [
      "light",
      {
        business: {
          ...require("daisyui/src/theming/themes")["business"],
          primary: '#d73502',
          "--pc": "100% 0 0"
        },
      }
    ],
    darkTheme: "business",
  },
}
