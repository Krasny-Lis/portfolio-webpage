module.exports = {
  root: true,
  ignorePatterns: ['**/*.js', '**/*.mjs', 'dist', 'node_modules'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.app.json', './tsconfig.spec.json'],
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended-requiring-type-checking'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-floating-promises': 'error'
  }
};
