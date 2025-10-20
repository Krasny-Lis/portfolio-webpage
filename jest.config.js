const esModules = ['@angular', '@ngrx', 'rxjs', 'tslib'].join('|');

module.exports = {
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transform: {
    '^.+\\.(ts|mjs|html|js)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        useESM: true
      }
    ]
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/testing/style-mock.ts'
  },
  transformIgnorePatterns: [`node_modules/(?!(${esModules}).*\\.mjs$)`],
  extensionsToTreatAsEsm: ['.ts']
};
