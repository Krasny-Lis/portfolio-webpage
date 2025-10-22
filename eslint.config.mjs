import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const withCommonLanguageOptions = (config, files) => {
  const languageOptions = {
    ...(config.languageOptions ?? {}),
    parser: tsParser,
    sourceType: 'module',
  };

  return {
    ...config,
    files: files ?? config.files ?? ['**/*.ts'],
    languageOptions,
    plugins: {
      ...(config.plugins ?? {}),
      '@typescript-eslint': tsPlugin,
    },
  };
};

const recommendedConfigs = tsPlugin.configs['flat/recommended'].map((config) =>
  withCommonLanguageOptions(config),
);

const typeCheckedConfigs = tsPlugin.configs['flat/recommended-type-checked'].map((config) => {
  const files = ['src/**/*.ts', 'cypress/**/*.ts', 'server.ts', 'cypress.config.ts'];
  const baseConfig = withCommonLanguageOptions(config, files);
  const baseLanguageOptions = baseConfig.languageOptions ?? {};

  return {
    ...baseConfig,
    ignores: ['src/**/*.spec.ts', 'src/testing/**/*.ts'],
    languageOptions: {
      ...baseLanguageOptions,
      parserOptions: {
        ...(baseLanguageOptions.parserOptions ?? {}),
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  };
});

export default [
  {
    ignores: ['**/*.js', '**/*.mjs', 'dist', 'node_modules'],
  },
  {
    ...js.configs.recommended,
  },
  ...recommendedConfigs,
  ...typeCheckedConfigs,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
];
