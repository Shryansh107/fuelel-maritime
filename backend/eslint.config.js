// @ts-check
import tseslint from 'typescript-eslint';

export default tseslint.config(
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    ignores: ['dist', 'node_modules'],
    rules: {
      'no-console': 'warn',
    },
  }
);


