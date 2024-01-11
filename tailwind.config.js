module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

module.exports = {
  // ...
  theme: {
    extend: {
      colors: {
        'brand-black': '#000000',
        'brand-gray': '#E5E5E5',
        'brand-orange': '#F2994A',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'], // Replace 'Inter' with the font used in the design if different
      },
    },
  },
  // ...
};

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'brand-black': '#000000',
        'brand-gray': '#E5E5E5',
        'brand-orange': '#F2994A',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'], // Replace 'Inter' with the font used in the design if different
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}