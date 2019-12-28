const path = require('path')

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [],
  extends: [
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
    'plugin:import/errors',
  ],

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: path.resolve(__dirname, './tsconfig.json'),
  },
  rules: {
    'no-warning-comments': 'warn',
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 'error',
    'prettier/prettier': 'error',
    'import/no-unresolved': 'error',
    'import/no-unused-modules': 'error',
    'import/no-cycle': 'error',
    'import/no-useless-path-segments': 'error',
    'import/export': 'error',
    'import/first': 'error',
    'import/exports-last': 'error',
    'import/no-duplicates': 'error',
    'import/extensions': 'error',
    'import/no-default-export': 'error',
    'import/dynamic-import-chunkname': 'error',
    'import/order': ['error', { 'newlines-between': 'always' }],
    'prefer-promise-reject-errors': 'error',
    'require-await': 'error',
    'prefer-object-spread': 'error',
    'no-dupe-class-members': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-destructuring': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'default-case': 'error',
    eqeqeq: 'error',
    'no-extra-bind': 'error',
    'no-implicit-globals': 'error',
    'no-invalid-this': 'error',
    'no-lone-blocks': 'error',
    'no-param-reassign': 'error',
    'no-throw-literal': 'error',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-ts-ignore': 'warn',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    'jest/no-commented-out-tests': 'warn',
    'jest/expect-expect': 'warn',
  },
  settings: {},
}