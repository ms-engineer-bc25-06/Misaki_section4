module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'script',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    node: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn', // warning レベルで表示
      {
        argsIgnorePattern: '^_', // アンダースコアで始まる引数を無視
        varsIgnorePattern: '^_', // アンダースコアで始まる変数を無視 (これも追加しておくと便利)
        caughtErrorsIgnorePattern: '^_', // catchブロックのエラー変数を無視
      },
    ],
  },
};
