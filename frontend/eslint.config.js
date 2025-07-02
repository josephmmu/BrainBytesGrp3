import js from '@eslint/js';
import react from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: { react },
    rules: {
      ...react.configs.recommended.rules,
      'no-console': 'warn',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
  },
];