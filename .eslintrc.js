module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint-config-ali/typescript/react', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [],
  rules: {
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-shadow': 'off',
  },
};
