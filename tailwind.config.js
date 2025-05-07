/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      rotate: {
        65: "60deg",
      },
      animation: {
        "fade-fr-t": "fade-fr-t 750ms ease-in-out",
        fade: "fade 300ms ease-in-out",
      },
      keyframes: {
        fade: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        "fade-fr-t": {
          "0%": {
            opacity: 0,
            transform: "translate(-50%,-100%)",
          },
          "50%": {
            opacity: 0,
            transform: "translate(-50%,-100%)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,0)",
          },
        },
      },
      colors: {
        default: "#f3f5ff",
        "default-100": "#dae6ff",
        "default-300": " #c4cfe5",
        main: "#243444",
        "main-500": "#183145",
        "main-300": "#465a6a",
        "main-100": "#8b98a2",
        secondary: "#0692da",
        "secondary-500": "#69bde8",
        "secondary-300": "#9bd3f0",
        "secondary-100": "#cde9f7",
        "secondary-hover": "#0474ae",
        "custom-gray": "#b5b5b5",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwind-scrollbar")({ nocompatible: true })],
};
