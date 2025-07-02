// eslint.config.js (for ESLint v9+ + Next.js)
import next from 'eslint-config-next';

export default [
  ...next(), // Import Next.js recommended rules
  {
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-console': 'warn',
    },
  },
];
