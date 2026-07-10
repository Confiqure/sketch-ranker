// ESLint 10 flat config (Next 16 dropped `next lint`; the legacy .eslintrc is gone).
// Mirrors the old config: next/core-web-vitals + typescript-eslint recommended +
// prettier-compat, with the same three project rules.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-config-prettier'

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...nextCoreWebVitals,
  ...tsPlugin.configs['flat/recommended'],
  prettier,
  {
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    // CLI tooling talks via console by design.
    files: ['scripts/**', 'prisma/**'],
    rules: { 'no-console': 'off' },
  },
]

export default config
