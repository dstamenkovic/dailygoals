module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'object-curly-spacing': [2, 'always'],
    'max-len': [2, 120, 2],
  }
};
