export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\.tsx?$": ["ts-jest", {
      "tsconfig": {
        "module": "esnext",
        "target": "esnext"
      }
    }]
  },
  moduleNameMapper: {
    "\.(css|less)$": "identity-obj-proxy"
  }
};

