/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
      colors: {
        "white-3000": "#ffffff",
        "just-black": "#00000",
        "purple-taupe": "#464152",
        "dove-gray": "#6c6c6c",
        silver: "#c4c4c4",
        "rainy-gray": "#a4a4a4",
        "raisin-black": "#222327",
        "chinese-black": "#161616",
        "chinese-silver": "#CDCDCD",
        "dark-charcoal": "#2F3036",
        "bright-gray": "#ECECF1",
        "outer-space": "#444654",
        "gun-metal": "#2E303E",
        "sonic-silver": "#747474",
        "soap": "#D8CCF1",
        "independence": "#54546D",
        "philippine-yellow": "#FFC700",
      }
    },
  },
  plugins: [],
};
