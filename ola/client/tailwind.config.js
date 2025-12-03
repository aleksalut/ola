/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Pink tones palette
        primary: "#EC4899", // pink-500
        primaryDark: "#DB2777", // pink-600
        accent: "#F472B6", // pink-400
        background: "#FDF2F8", // pink-50
        surface: "#FCE7F3", // pink-100
        surfaceAlt: "#FBCFE8", // pink-200
        border: "#F9A8D4", // pink-300
        text: "#1F2937", // slate-800
      }
    }
  },
  plugins: []
}
