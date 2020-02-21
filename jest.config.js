/**
 * @link
 */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^src$": "<rootDir>/src/index.ts",
  },
  testMatch: ["<rootDir>/__test__/**/*.(spec|test).(j|t)s?(x)"],
  setupFiles: ["<rootDir>/__mock__/index.js"],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.build.json",
    },
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$",
  ],
}
