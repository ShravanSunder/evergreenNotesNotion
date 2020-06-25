module.exports = {
   parser: '@typescript-eslint/parser',
   parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
   },
   extends: ['plugin:@typescript-eslint/recommended'],
   rules: {
      // place to specify ESLint rules - can be used to overwrite rules specified from the extended configs
      // e.g. "@typescript-eslint/explicit-function-return-type": "off",
   },
};
