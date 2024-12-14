import {nextui} from '@nextui-org/theme';
/** @type {import('tailwindcss').Config} */

const screens = {
  phone: "600px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1270px",
  television: "1600px",
};

const colors = {
  black: {
    500: "#171717",
  },
  denim: {
    500: "#6F8FAF",
  },
  cream: {
    500: "#FFFDD0",
  },
  brown: {
    500: "#964B00",
  },
  silver: {
    500: "#C0C0C0",
  },
};

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/containers/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/components/atoms/**/*.{js,ts,jsx,tsx}",
    "./src/components/molecules/**/*.{js,ts,jsx,tsx}",
    "./src/components/organisms/**/*.{js,ts,jsx,tsx}",
    "./src/components/templates/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
    "./src/designs/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|pagination|select|ripple|spinner|listbox|divider|popover|scroll-shadow).js"
  ],
  theme: {
    extend: {
      screens,
      colors: colors,
    },
  },
  plugins: [nextui()],
};
