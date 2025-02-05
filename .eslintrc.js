module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true, // Jest environment
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended", // React plugin
    "plugin:@typescript-eslint/recommended", // TypeScript plugin
    "plugin:react-hooks/recommended", // React hooks plugin (good for managing React hooks rules)
  ],
  parser: "@typescript-eslint/parser", // Use TypeScript parser
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Enable JSX
    },
    ecmaVersion: 2021, // Use ECMAScript 2021 (latest) version
    sourceType: "module", // Support for ECMAScript modules
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "jest", // Add Jest plugin
  ],
  rules: {
    // Custom rules can be added here
    "@typescript-eslint/no-unused-vars": ["warn"], // Example rule to warn about unused variables
    "react/prop-types": "off", // Disable prop-types since we're using TypeScript for type checking
    "@typescript-eslint/explicit-module-boundary-types": "off", // Optional: disable explicit return types for functions (if preferred)
  },
  settings: {
    react: {
      version: "detect", // Automatically detect React version
    },
  },
};
