import globals from 'globals';

export default [
  {
    files: ['src/**/*.js'],
    // Remplacés au build par scripts/build-meta.js
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: { ...globals.browser, __BUILD__: 'readonly', __BUILD_MSG__: 'readonly' } },
    rules: { 'no-undef': 'error' },
  },
];
