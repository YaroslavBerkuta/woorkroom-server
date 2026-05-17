// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'scripts/**', 'dist/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        project: [
          './apps/authorization/tsconfig.app.json',
          './apps/companys/tsconfig.app.json',
          './apps/gateway/tsconfig.app.json',
          './apps/mails/tsconfig.app.json',
          './apps/media/tsconfig.app.json',
          './apps/projects/tsconfig.app.json',
          './apps/users/tsconfig.app.json',
          './libs/config/tsconfig.lib.json',
          './libs/database/tsconfig.lib.json',
          './libs/grpc/tsconfig.lib.json',
          './libs/mongo/tsconfig.lib.json',
          './libs/rabbitmq/tsconfig.lib.json',
          './libs/redis/tsconfig.lib.json',
          './libs/smtp/tsconfig.lib.json',
          './libs/telegram/tsconfig.lib.json',
          './tsconfig.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);
