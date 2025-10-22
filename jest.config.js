const esModules = ['@angular', 'rxjs', 'tslib'].join('|');

module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/testing/style-mock.ts'
  },
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        useESM: true,
        allowJs: true,
        stringifyContentPathRegex: '\\.(html|svg)$'
      }
    ]
  },
  transformIgnorePatterns: [`node_modules/(?!(${esModules}).*\\.(mjs|js)$)`],
  extensionsToTreatAsEsm: ['.ts']
};
