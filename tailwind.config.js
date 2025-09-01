module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminalGreen: '#39FF14',
        terminalAmber: '#FFBF00',
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'Fira Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
