// module.exports = {
//   preset: "ts-jest", // If you're using ts-jest for transforming TypeScript
//   testEnvironment: "jsdom",
//   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
//   transform: {
//     "^.+\\.(ts|tsx|js|jsx)$": "babel-jest", // Ensure Babel is used for all files
//   },
//   moduleNameMapper: {
//     "^react-router-dom$": "<rootDir>/__mocks__/react-router-dom.tsx",
//   },
// };

// module.exports = {
//   preset: "ts-jest",
//   testEnvironment: "jsdom",
//   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
//   transform: {
//     "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
//   },
//   testMatch: [
//     "**/tests/**/*.test.tsx", 
//     "**/src/**/*.test.tsx"
//   ],
//   transformIgnorePatterns: [
//     "node_modules/(?!lucide-react)"
//   ],
// };

// jest.config.js
// module.exports = {
//   preset: "ts-jest",
//   testEnvironment: "jsdom",
//   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
//   globals: {
//     "ts-jest": {
//       babelConfig: true, // Use your Babel configuration for TS files
//     },
//   },
//   transform: {
//     "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
//     "^node_modules/lucide-react/.*\\.js$": "babel-jest",
//   },
//   testMatch: [
//     "**/tests/**/*.test.tsx", 
//     "**/src/**/*.test.tsx"
//   ],
//   transformIgnorePatterns: [
//     "/node_modules/(?!(lucide-react)/)"
//   ],
//   moduleNameMapper: {
//     '^lucide-react$': '<rootDir>/__mocks__/lucide-react.js',
//   },
// };


module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  globals: {
    "ts-jest": {
      babelConfig: true, // Make ts-jest use your babel.config.cjs
    },
  },
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  // Allow lucide-react to be transformed by Babel even though it's in node_modules.
  transformIgnorePatterns: ["/node_modules/(?!(lucide-react)/)"],
  moduleNameMapper: {
    '^lucide-react$': '<rootDir>/__mocks__/lucide-react.js',
  },
  testMatch: [
    "**/tests/**/*.test.tsx", 
    "**/src/**/*.test.tsx"
  ],
};
