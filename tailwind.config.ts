/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#104A52",
          50: "#E7F3F4",
          100: "#C4E2E4",
          200: "#9CCDD1",
          300: "#74B8BE",
          400: "#4FA4AB",
          500: "#104A52", // Primary
          600: "#0D3B42",
          700: "#092D32",
          800: "#061E21",
          900: "#030F11",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
