/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#6D87ED",
          light: "#8CA3FF",
          lighter: "#DAE1FF",
          gradFrom: "#ADBCF7",
        },
        tag: {
          redDeep: "#C25D5D",
          redLight: "#FAF0ED",
          yellowDeep: "#8F752B",
          yellowLight: "#FFF6E4",
          greenDeep: "#648969",
          greenLight: "#E4FBE4",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #ADBCF7 0%, #6D87ED 100%)",
      },
      boxShadow: {
        soft: "0 2px 14px rgba(15,23,42,0.06)",
        pop: "0 10px 30px rgba(15,23,42,0.18)",
        modal: "0 14px 40px rgba(15,23,42,0.18)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
