// import konstaConfig config
const konstaConfig = require('konsta/config');

// wrap config with konstaConfig config
module.exports = konstaConfig({
  content: [
    './components/*.{js,ts,jsx,vue}',
    './pages/*.{js,ts,jsx,vue}',
  ],
  darkMode: 'class', // media or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
});