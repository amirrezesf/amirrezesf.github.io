/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  // Matches the data-theme attribute from the theme script. Needs Tailwind 3.4.1+.
  // If your toggle uses a "dark" class instead, use: darkMode: "class"
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        accent: {
          teal: "rgb(var(--color-accent-teal) / <alpha-value>)",
          blue: "rgb(var(--color-accent-blue) / <alpha-value>)",
        },
        subtle: "rgb(var(--color-subtle) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};