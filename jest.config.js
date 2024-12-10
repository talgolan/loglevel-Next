export default {
  testEnvironment: "jsdom",
  setupFiles: ["jest-localstorage-mock"], // Auto-mock localStorage
  transform: {
    "^.+\\.js$": ["babel-jest", { presets: ["@babel/preset-env"] }],
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  testMatch: ["**/__tests__/**/*.test.js"],
};
