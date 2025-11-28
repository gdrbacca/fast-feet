import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
// import vitest from '@vitest/eslint-plugin' // opcional

/** @type {import('eslint').Linter.Config[]} */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})
export default [
  ...compat.extends('@rocketseat/eslint-config/node'),
  {
    files: ['**/*.ts'],
    ignores: ['node_modules/*', 'build/*', 'dist/*'],
    rules: {
      'no-useless-constructor': 'off',
      'no-new': 'off'
    },
    languageOptions: { // opcional
      globals: {
       // ...vitest.environments.env.globals,
      },
    },
  },
]
