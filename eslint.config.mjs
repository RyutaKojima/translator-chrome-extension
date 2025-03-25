import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/build/',
    '**/*.min.js',
    '**/*.bundle.js',
    '**/*.config.js',
    '**/*.log',
    '**/.DS_Store',
    '**/.vscode/',
  ]),
  {
    extends: compat.extends(
      'eslint:recommended',
      'plugin:prettier/recommended'
    ),

    languageOptions: {
      globals: {
        ...globals.browser,
        chrome: 'readonly',
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {
      'prettier/prettier': 'error',
    },
  },
])
