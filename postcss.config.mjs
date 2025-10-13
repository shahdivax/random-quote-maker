const config = {
  plugins: [
    "@tailwindcss/postcss",
    [
      "postcss-preset-env",
      {
        features: {
          "color-function": {
            preserve: true
          }
        }
      }
    ]
  ],
};

export default config;
