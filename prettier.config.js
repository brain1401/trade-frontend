//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  semi: true,
  tabWidth: 2,
  singleQuote: false,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/styles.css",
};

export default config;
