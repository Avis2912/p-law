module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2020,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "max-len": "off",
    "object-curly-spacing": "off",
    "require-jsdoc": "off",
    "no-restricted-globals": "off",
    "no-nested-ternary": "off",
    "prefer-arrow-callback": "error",
    "no-control-regex": "off",
    "no-await-in-loop": "off",
    "no-restricted-syntax": "off",
    "no-unused-vars": "off",
    "quotes": "off",
    "prefer-const": "off",
    "no-trailing-spaces": "off",
    "padded-blocks": "off",
    "key-spacing": "off",
    "indent": "off",
    "block-spacing": "off",
    "arrow-parens": "off",
    "comma-dangle": "off",
    "eol-last": "off",
    "keyword-spacing": "off",
    "semi": "off",
    "no-extra-semi": "off",
    "space-before-blocks": "off",
    "no-multi-spaces": "off",
    "no-constant-condition": "off",
    "no-self-compare": "off",
    "import/newline-after-import": "off",
    "import/no-unused-imports": "off",
    "import/no-relative-packages": "off",
    "one-var": "off",
    "spaced-comment": "off",
    "comma-spacing": "off",
    "brace-style": "off",
    "no-multiple-empty-lines": "off",
    "func-call-spacing": "off",
    "space-before-function-paren": "off",
    "import/order": "off",
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
