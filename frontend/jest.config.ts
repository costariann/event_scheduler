export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '.(css|less)$': 'identity-obj-proxy',
  },
};
